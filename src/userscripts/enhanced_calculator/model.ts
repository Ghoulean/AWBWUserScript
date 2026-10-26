export type TrueHpRange = [number, number]

export interface CombatResult {
    minDamage: number
    maxDamage: number
    attackerDeathChance: number
    defenderDeathChance: number
    defenderHpAfter: TrueHpRange
    attackerHpAfter: TrueHpRange
}
