import { CO, UnitType, COPowerType, Terrain } from "../common/types"

export type Damage = number[]
export type Luck = number

export interface CombatModifiers {
    ammoless?: boolean
    isCounterattack?: boolean
    isDefendingAgainstIndirect?: boolean
}

export interface CombatParticipant {
    co: CO
    unit: UnitType
    cop: COPowerType
    visualHp: number
    terrain: Terrain
    numComTowers: number
    numCities: number
    currentGold: number
}

export interface Combat {
    attacker: CombatParticipant
    defender: CombatParticipant
    combatModifiers: CombatModifiers
}
