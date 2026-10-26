import { Combat, CombatParticipant } from "src/calc/types"
import { parseAWBWCalculatorSide } from "src/calc/utils/awbw_utils"
import { pointMass, uniformForVisualHp } from "src/calc/hp_distribution"
import { convertTileIdToTerrain } from "src/common/awbw_utils"
import { CO, COPowerType, Terrain, UnitType } from "src/common/types"
import { computeCombatResult } from "src/userscripts/better_calculator/combat_result"

const andy_tank: CombatParticipant = {
    co: CO.Andy,
    unit: UnitType.Tank,
    cop: COPowerType.None,
    visualHp: 10,
    terrain: Terrain.Plains,
    numCommTowers: 0,
    numCities: 0,
    currentGold: 0,
}

test("defender true HP decides death chance and counterattack", () => {
    const combat: Combat = {
        attacker: andy_tank,
        defender: { ...andy_tank, visualHp: 6 },
        combatModifiers: {},
    }

    const result = computeCombatResult(combat, pointMass(100), pointMass(55))

    expect(result.minDamage).toBe(51)
    expect(result.maxDamage).toBe(60)
    expect(result.defenderDeathChance).toBeCloseTo(0.6)
    expect(result.attackerDeathChance).toBe(0)
    expect(result.defenderHpAfter).toEqual([0, 4])
    expect(result.attackerHpAfter).toEqual([95, 100])
})

test("death chance averages over the defender's true HP distribution", () => {
    const combat: Combat = {
        attacker: andy_tank,
        defender: { ...andy_tank, visualHp: 6 },
        combatModifiers: {},
    }

    const result = computeCombatResult(
        combat,
        pointMass(100),
        uniformForVisualHp(6),
    )

    expect(result.defenderDeathChance).toBeCloseTo(0.55)
    expect(result.defenderHpAfter).toEqual([0, 9])
})

test("indirect attacks are not counterattacked", () => {
    const combat: Combat = {
        attacker: { ...andy_tank, unit: UnitType.Artillery },
        defender: andy_tank,
        combatModifiers: {},
    }

    const result = computeCombatResult(combat, pointMass(73), pointMass(100))

    expect(result.defenderDeathChance).toBe(0)
    expect(result.attackerHpAfter).toEqual([73, 73])
})

test("parses AWBW calculator side", () => {
    const participant = parseAWBWCalculatorSide({
        co: { co_id: 3, co_name: "Kanbei" },
        unit: { units_id: 4, units_name: "Tank", units_ammo: 0 },
        terrain: {
            terrain_id: 112,
            terrain_name: "MissileSiloEmpty",
            terrain_defense: 3,
        },
        power: "S",
        hp: "9",
        hasAmmo: false,
        cities: 7,
        towers: "2",
        funds: 2360,
    })

    expect(participant).toEqual({
        co: CO.Kanbei,
        unit: UnitType.Tank,
        cop: COPowerType.SCOP,
        visualHp: 9,
        terrain: Terrain.MissileSilo,
        numCommTowers: 2,
        numCities: 7,
        currentGold: 2360,
        ammoless: true,
    })
})

test("parses plains terrain", () => {
    expect(convertTileIdToTerrain(1)).toBe(Terrain.Plains)
})

test("indirect defenders do not counterattack", () => {
    const combat: Combat = {
        attacker: andy_tank,
        defender: { ...andy_tank, unit: UnitType.Artillery },
        combatModifiers: {},
    }

    const result = computeCombatResult(combat, pointMass(100), pointMass(100))

    expect(result.attackerHpAfter).toEqual([100, 100])
})

test("attacker death chance skips counterattacks after a kill", () => {
    const one_hp_tank = { ...andy_tank, visualHp: 1 }
    const combat: Combat = {
        attacker: one_hp_tank,
        defender: one_hp_tank,
        combatModifiers: {},
    }

    const result = computeCombatResult(combat, pointMass(6), pointMass(6))

    expect(result.defenderDeathChance).toBeCloseTo(0.4)
    expect(result.attackerDeathChance).toBeCloseTo(0.6 * 0.4)
})
