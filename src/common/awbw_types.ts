export interface AWBWUnit {
    generic_id: number
    units_player_id: number
    units_ammo: number
    units_hit_points: number
    units_x: number
    units_y: number
}

export interface AWBWPlayerInfo {
    users_username: string
    players_id: number
    players_countries_id: number
    players_co_id: number
    players_co_power: number
    players_co_power_on: string
    players_co_max_power: number
    players_co_max_spower: number
    players_funds: number
    cities: number
    labs: number
    towers: number
    players_order: number
    players_income: number
}

export type AWBWPlayersInfo = {
    [key: number]: AWBWPlayerInfo
}

export interface AWBWTerrain {
    terrain_id: number
}

export type AWBWTerrainInfo = {
    [key: number]: {
        [key: number]: AWBWTerrain
    }
}

export interface AWBWBuilding {
    buildings_capture: number
    countries_id: number
    terrain_id: number
}

export type AWBWBuildingsInfo = { [key: number]: AWBWBuilding }[]

export type AWBWCalculatorSideName = "attacker" | "defender"

export interface AWBWCalculatorSide {
    co: { co_id: number; co_name: string }
    unit: { units_id: number; units_name: string; units_ammo: number }
    terrain: {
        terrain_id: number
        terrain_name: string
        terrain_defense: number
    }
    power: string
    hp: number | string
    hasAmmo: boolean
    cities: number | string
    towers: number | string
    funds: number | string
}

export interface AWBWCalculator {
    attacker: AWBWCalculatorSide
    defender: AWBWCalculatorSide
    addUnitToCalc: (side: AWBWCalculatorSideName, unitId: number) => unknown
    swapPosition: () => unknown
    updateDamage: () => unknown
    $watch: (
        getter: () => unknown,
        callback: () => void,
        options?: { deep?: boolean },
    ) => () => void
}
