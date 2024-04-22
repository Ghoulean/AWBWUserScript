import { CO, UnitType, COPowerType, Terrain } from "../common/types"

export type Damage = number[]

// chip damage length >= 1. note that "zero" is represented as [1]
export type ChipDamage = number[]
export const ZERO_CHIP_DAMAGE = [1]

// [2, [1, 2]] indicates 21 or 22 damage
export type VisualDamageAndChip = [number, ChipDamage]

// chip is ALWAYS represented as damage here -- so [2, [1, 2]] indicates 19 or 18 health
export type VisualHealthAndChip = [number, ChipDamage]

// visual health + likelihood
export type VisualHealthHistogram = [number, number][]
export type Luck = number

export interface CombatModifiers {
    isCounterattack?: boolean
    isDefendingAgainstIndirect?: boolean
}

export interface CombatParticipant {
    co: CO
    unit: UnitType
    cop: COPowerType
    visualHp: number
    terrain: Terrain
    numCommTowers: number
    numCities: number
    currentGold: number
    ammoless?: boolean
}

export interface Combat {
    attacker: CombatParticipant
    defender: CombatParticipant
    combatModifiers: CombatModifiers
}
