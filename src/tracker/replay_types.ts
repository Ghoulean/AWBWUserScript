export interface ReplayUnit {
    units_id: number
    units_players_id: number
    generic_id?: number
    units_name?: string
    units_hit_points: number
    units_ammo: number
    units_x: number
    units_y: number
}

export interface ReplayPlayer {
    players_id: number
    players_co_id: number
    players_co_power_on: string
    players_funds: number
    cities: number
    towers: number
}

export interface ReplayCombatant {
    units_id: number
    units_hit_points: number
    units_ammo: number
    units_x: number
    units_y: number
}

export interface ReplayUnitHp {
    units_id: number
    units_hit_points: number
}

export interface ReplayAction {
    action: string
    [key: string]: unknown
}

export interface ReplayTurn {
    day: number
    units: ReplayUnit[]
    players: ReplayPlayer[]
    actions: ReplayAction[]
}
