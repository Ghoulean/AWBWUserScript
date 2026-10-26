import { Combat } from "src/calc/types"
import { calculateCombatDamage, canCounterattack } from "src/calc/calc"
import {
    HpDistribution,
    applyDamage,
    hpRange,
    mixDistributions,
    visualHpOf,
} from "src/calc/hp_distribution"
import { CombatResult } from "./model"

export function computeCombatResult(
    combat: Combat,
    attackerHp: HpDistribution,
    defenderHp: HpDistribution,
): CombatResult {
    const primary_damage = calculateCombatDamage(combat)
    const defender_after = applyDamage(defenderHp, primary_damage)

    const can_counter = canCounterattack(combat)
    const counter_damage_by_visual_hp = new Map<number, number[]>()
    const attacker_after_parts: [number, HpDistribution][] = []
    for (let hp = 0; hp < defender_after.length; hp++) {
        const p = defender_after[hp]
        if (p === 0) continue
        if (hp === 0 || !can_counter) {
            attacker_after_parts.push([p, attackerHp])
            continue
        }
        const visual_hp = visualHpOf(hp)
        let counter_damage = counter_damage_by_visual_hp.get(visual_hp)
        if (!counter_damage) {
            counter_damage = calculateCombatDamage({
                attacker: { ...combat.defender, visualHp: visual_hp },
                defender: combat.attacker,
                combatModifiers: { isCounterattack: true },
            })
            counter_damage_by_visual_hp.set(visual_hp, counter_damage)
        }
        attacker_after_parts.push([p, applyDamage(attackerHp, counter_damage)])
    }

    const attacker_after = mixDistributions(attacker_after_parts)

    return {
        minDamage: primary_damage[0],
        maxDamage: primary_damage[primary_damage.length - 1],
        attackerDeathChance: attacker_after[0],
        defenderDeathChance: defender_after[0],
        defenderHpAfter: hpRange(defender_after),
        attackerHpAfter: hpRange(attacker_after),
    }
}
