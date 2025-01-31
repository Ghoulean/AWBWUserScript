import {
    CO,
    COPowerType,
    INDIRECT_UNITS,
} from "../common/types"
import { getTerrainStars } from "../common/utils"
import { getBaseAmmolessDamage, getBaseDamage } from "./utils/base_damage_map"
import { getAttackValue } from "./utils/get_attack_value"
import { getDefenseValue } from "./utils/get_defense_value"
import { getMaxBadLuck, getMaxGoodLuck } from "./utils/get_luck"
import { Combat, CombatParticipant, Damage, Luck, VisualDamageAndChip, VisualHealthAndChip } from "./types"
import { addChipDamages, simplifyChip } from "./utils/utils"

interface DamageFormulaParameters {
    base: number
    attack_value: number
    luck_roll: Luck
    bad_luck_roll: Luck
    visual_hp_attacker: number
    defense_value: number
    defense_terrain_stars: number
    visual_hp_defender: number
}

export function calculateCombatDamage(combat: Combat): Damage {
    let max_good_luck: Luck = getMaxGoodLuck(combat.attacker)
    let max_bad_luck: Luck = getMaxBadLuck(combat.attacker)
    let attack_value = getAttackValue(combat.attacker, combat.combatModifiers)

    // todo: fix data structure modeling to avoid this spaghetti
    let defense_value = getDefenseValue(combat.defender, {
        ...combat.combatModifiers,
        isDefendingAgainstIndirect: INDIRECT_UNITS.has(combat.attacker.unit),
    })
    let terrain_stars = getDefenderTerrainStarsForCalculator(combat.defender)

    let base_damage = combat.attacker.ammoless
        ? getBaseAmmolessDamage(combat.attacker.unit, combat.defender.unit)
        : getBaseDamage(combat.attacker.unit, combat.defender.unit) ||
          getBaseAmmolessDamage(combat.attacker.unit, combat.defender.unit)

    let retVal = []
    for (let bad_luck = 0; bad_luck <= max_bad_luck; bad_luck += 1) {
        for (let good_luck = 0; good_luck <= max_good_luck; good_luck += 1) {
            retVal.push(
                damage_formula({
                    base: base_damage,
                    attack_value: attack_value,
                    luck_roll: good_luck,
                    bad_luck_roll: bad_luck,
                    visual_hp_attacker: combat.attacker.visualHp,
                    defense_value: defense_value,
                    defense_terrain_stars: terrain_stars,
                    visual_hp_defender: combat.defender.visualHp,
                }),
            )
        }
    }

    return retVal.sort((a, b) => a - b)
}

export function calculateResultingHp(initial: VisualHealthAndChip, damage: VisualDamageAndChip): VisualHealthAndChip {
    const new_chip = addChipDamages(initial[1], damage[1])
    const simplified_chip = simplifyChip(new_chip);
    const new_health = initial[0] - damage[0] - simplified_chip[0];
    return [new_health, simplified_chip[1]]
}

function getDefenderTerrainStarsForCalculator(defender: CombatParticipant) {
    return (
        getTerrainStars(defender.terrain) *
        (defender.co == CO.Lash && defender.cop == COPowerType.SCOP ? 2 : 1)
    )
}

function damage_formula(parameters: DamageFormulaParameters): number {
    const unrounded_damage =
        (((((parameters.base * parameters.attack_value) / 100 +
            parameters.luck_roll -
            parameters.bad_luck_roll) *
            parameters.visual_hp_attacker) /
            10) *
            (200 -
                (parameters.defense_value +
                    parameters.defense_terrain_stars *
                        parameters.visual_hp_defender))) /
        100
    return Math.floor(Math.ceil(Math.max(0, unrounded_damage) * 20) / 20)
}
