import { calculateCombatDamage, canCounterattack } from "src/calc/calc"
import {
    HpDistribution,
    applyDamage,
    conditionOnVisualHp,
    hpRange,
    pointMass,
    shiftHp,
    uniformForVisualHp,
} from "src/calc/hp_distribution"
import { Combat, CombatParticipant } from "src/calc/types"
import { parseCOPowerOn, parseUnitName } from "src/common/awbw_utils"
import { CO, COPowerType, Terrain, UnitType } from "src/common/types"
import {
    ReplayAction,
    ReplayCombatant,
    ReplayPlayer,
    ReplayTurn,
    ReplayUnit,
    ReplayUnitHp,
} from "./replay_types"

export type TerrainLookup = (x: number, y: number) => Terrain

export interface TrackerReset {
    day: number
    unitId: number
    reason: string
    detail?: string
}

export interface TrackerResult {
    distributions: Map<number, HpDistribution>
    resets: TrackerReset[]
}

interface TrackedUnit {
    id: number
    playerId: number
    unit: UnitType
    x: number
    y: number
    ammo: number
    visualHp: number
    hp: HpDistribution
}

export function trackTrueHp(
    turns: ReplayTurn[],
    getTerrain: TerrainLookup,
): TrackerResult {
    const units = new Map<number, TrackedUnit>()
    const resets: TrackerReset[] = []
    let players = new Map<number, ReplayPlayer>()
    let day = 0

    function observe(
        unit: TrackedUnit,
        visualHp: number,
        candidates: HpDistribution[],
        reason: string,
        detail?: string,
    ): void {
        unit.visualHp = visualHp
        if (visualHp <= 0) {
            units.delete(unit.id)
            return
        }
        for (const candidate of candidates) {
            const conditioned = conditionOnVisualHp(candidate, visualHp)
            if (conditioned) {
                unit.hp = conditioned
                return
            }
        }
        unit.hp = uniformForVisualHp(visualHp)
        resets.push({ day, unitId: unit.id, reason, detail })
    }

    function track(unit: ReplayUnit, hp: HpDistribution): TrackedUnit {
        const tracked: TrackedUnit = {
            id: unit.units_id,
            playerId: unit.units_players_id,
            unit: unit.generic_id ?? parseUnitName(unit.units_name ?? "")!,
            x: unit.units_x,
            y: unit.units_y,
            ammo: Number(unit.units_ammo),
            visualHp: Number(unit.units_hit_points),
            hp,
        }
        units.set(tracked.id, tracked)
        return tracked
    }

    function participant(
        unit: TrackedUnit,
        ammoless: boolean,
    ): CombatParticipant {
        const player = players.get(unit.playerId)
        return {
            co: Number(player?.players_co_id),
            cop: parseCOPowerOn(player?.players_co_power_on ?? "N"),
            unit: unit.unit,
            visualHp: unit.visualHp,
            terrain: getTerrain(unit.x, unit.y),
            numCommTowers: Number(player?.towers ?? 0),
            numCities: Number(player?.cities ?? 0),
            currentGold: Number(player?.players_funds ?? 0),
            ammoless,
        }
    }

    function syncSnapshot(snapshot: ReplayUnit[], isFirstTurn: boolean) {
        const seen = new Set<number>()
        for (const unit of snapshot) {
            seen.add(unit.units_id)
            const visual_hp = Number(unit.units_hit_points)
            const tracked = units.get(unit.units_id)
            if (!tracked) {
                track(
                    unit,
                    isFirstTurn
                        ? pointMass(visual_hp * 10)
                        : uniformForVisualHp(visual_hp),
                )
                continue
            }
            tracked.playerId = unit.units_players_id
            tracked.unit = unit.generic_id ?? tracked.unit
            tracked.x = unit.units_x
            tracked.y = unit.units_y
            tracked.ammo = Number(unit.units_ammo)
            const delta = visual_hp - tracked.visualHp
            if (delta > 0) {
                observe(
                    tracked,
                    visual_hp,
                    [20, 10, delta * 10].map((heal) =>
                        shiftHp(tracked.hp, heal),
                    ),
                    "turn start heal",
                )
            } else if (delta < 0) {
                observe(
                    tracked,
                    visual_hp,
                    [shiftHp(tracked.hp, delta * 10)],
                    "turn start damage",
                )
            }
        }
        for (const id of [...units.keys()]) {
            if (!seen.has(id)) {
                units.delete(id)
            }
        }
    }

    function handleFire(attacker: ReplayCombatant, defender: ReplayCombatant) {
        const att = units.get(attacker.units_id)
        const def = units.get(defender.units_id)
        if (!att || !def) {
            return
        }
        att.x = attacker.units_x
        att.y = attacker.units_y

        const attacker_ammoless =
            att.ammo <= 0 && Number(attacker.units_ammo) <= 0
        const defender_ammoless =
            def.ammo <= 0 && Number(defender.units_ammo) <= 0
        const combat = {
            attacker: participant(att, attacker_ammoless),
            defender: participant(def, defender_ammoless),
            combatModifiers: {},
        }
        const damage = calculateCombatDamage(combat)
        const prior_def = hpRange(def.hp)
        observe(
            def,
            Number(defender.units_hit_points),
            [applyDamage(def.hp, damage)],
            "fire",
            describeCombat(combat, damage, prior_def),
        )
        def.ammo = Number(defender.units_ammo)

        let attacker_candidate = att.hp
        let counter_detail = "no counterattack"
        if (def.visualHp > 0 && canCounterattack(combat)) {
            const counter = {
                attacker: participant(def, defender_ammoless),
                defender: participant(att, attacker_ammoless),
                combatModifiers: { isCounterattack: true },
            }
            const counter_damage = calculateCombatDamage(counter)
            attacker_candidate = applyDamage(att.hp, counter_damage)
            counter_detail = describeCombat(
                counter,
                counter_damage,
                hpRange(att.hp),
            )
        }
        observe(
            att,
            Number(attacker.units_hit_points),
            [attacker_candidate],
            "counterattack",
            counter_detail,
        )
        att.ammo = Number(attacker.units_ammo)
    }

    function handlePowerHp(playerId: number, changes: ReplayUnitHp[]) {
        const observed = changes
            .map((change) => ({
                unit: units.get(change.units_id),
                visualHp: Number(change.units_hit_points),
            }))
            .filter(
                (change): change is { unit: TrackedUnit; visualHp: number } =>
                    change.unit !== undefined && !Number.isNaN(change.visualHp),
            )
        for (const own of [true, false]) {
            const group = observed.filter(
                ({ unit }) => (unit.playerId === playerId) === own,
            )
            const steps = [
                ...new Set(
                    group
                        .filter(
                            ({ unit, visualHp }) =>
                                visualHp > 1 &&
                                visualHp < 10 &&
                                visualHp !== unit.visualHp,
                        )
                        .map(
                            ({ unit, visualHp }) =>
                                (visualHp - unit.visualHp) * 10,
                        ),
                ),
            ].sort((a, b) => Math.abs(a) - Math.abs(b))
            for (const { unit, visualHp } of group) {
                const deltas = [...steps, (visualHp - unit.visualHp) * 10, 0]
                observe(
                    unit,
                    visualHp,
                    deltas.map((delta) => shiftHp(unit.hp, delta)),
                    "power",
                )
            }
        }
    }

    function handleUnknown(action: ReplayAction) {
        for (const change of findUnitHps(action)) {
            const unit = units.get(change.units_id)
            const visual_hp = Number(change.units_hit_points)
            if (!unit || visual_hp === unit.visualHp) continue
            observe(
                unit,
                visual_hp,
                [shiftHp(unit.hp, (visual_hp - unit.visualHp) * 10)],
                action.action,
            )
        }
    }

    turns.forEach((turn, index) => {
        day = turn.day
        players = new Map(
            turn.players.map((player) => [player.players_id, { ...player }]),
        )
        syncSnapshot(turn.units, index === 0)

        for (const action of turn.actions) {
            if (action.action === "Build" && "newUnit" in action) {
                const unit = action.newUnit as ReplayUnit
                track(unit, pointMass(Number(unit.units_hit_points) * 10))
            } else if (action.action === "Fire" && "attacker" in action) {
                const attacker = action.attacker as ReplayCombatant
                const defender = action.defender as ReplayCombatant
                try {
                    handleFire(attacker, defender)
                } catch (e) {
                    for (const combatant of [attacker, defender]) {
                        const unit = units.get(combatant.units_id)
                        if (unit) {
                            observe(
                                unit,
                                Number(combatant.units_hit_points),
                                [],
                                `fire error: ${e}`,
                            )
                        }
                    }
                }
            } else if (action.action === "Power" && "playerId" in action) {
                const player = players.get(Number(action.playerId))
                if (player) {
                    player.players_co_power_on = String(action.coPower)
                }
                const replace = action.unitReplace as
                    | { units?: ReplayUnitHp[] }
                    | undefined
                handlePowerHp(Number(action.playerId), replace?.units ?? [])
            } else if (action.action === "Repair" && "repairedUnit" in action) {
                const repaired = action.repairedUnit as ReplayUnitHp
                const unit = units.get(repaired.units_id)
                if (unit) {
                    observe(
                        unit,
                        Number(repaired.units_hit_points),
                        [shiftHp(unit.hp, 10)],
                        "repair",
                    )
                }
            } else {
                handleUnknown(action)
            }
        }
    })

    return {
        distributions: new Map(
            [...units.values()].map((unit) => [unit.id, unit.hp]),
        ),
        resets,
    }
}

function describeCombat(
    combat: Combat,
    damage: number[],
    priorDefenderHp: [number, number],
): string {
    const side = (p: CombatParticipant) =>
        `${CO[p.co]}${p.cop ? `(${COPowerType[p.cop]})` : ""} ${UnitType[p.unit]}` +
        ` ${p.visualHp}hp ${Terrain[p.terrain]}${p.ammoless ? " ammoless" : ""}`
    return (
        `${side(combat.attacker)} -> ${side(combat.defender)}` +
        ` damage ${damage[0]}-${damage[damage.length - 1]}` +
        ` prior ${priorDefenderHp[0]}-${priorDefenderHp[1]}`
    )
}

function findUnitHps(value: unknown, depth = 0): ReplayUnitHp[] {
    if (!value || typeof value !== "object" || depth > 4) {
        return []
    }
    if (Array.isArray(value)) {
        return value.flatMap((item) => findUnitHps(item, depth + 1))
    }
    const record = value as Record<string, unknown>
    if (
        record.units_id !== undefined &&
        record.units_hit_points !== undefined
    ) {
        return [record as unknown as ReplayUnitHp]
    }
    return Object.values(record).flatMap((item) => findUnitHps(item, depth + 1))
}
