export interface DamageResult {
    minDamage: number
    maxDamage: number
    minFundsDamage: number
    maxFundsDamage: number
}

export interface CounterattackScenario {
    visualHp: number
    minDamage: number
    maxDamage: number
    minFundsDamage: number
    maxFundsDamage: number
}

export interface CombatResult {
    attackerDamage: DamageResult
    counterattackAtMinDamage: CounterattackScenario | null
    counterattackAtMaxDamage: CounterattackScenario | null
}
