import { Terrain, UnitType } from "./types"

const ZERO_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.River,
    Terrain.Road,
    Terrain.Bridge,
    Terrain.Sea,
    Terrain.Shoal,
    Terrain.Pipe,
])

const ONE_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.Plains,
    Terrain.Reef,
    Terrain.BrokenPipe,
])

const TWO_TERRAIN_STARS: Set<Terrain> = new Set([Terrain.Woods])

const THREE_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.City,
    Terrain.Base,
    Terrain.Airport,
    Terrain.Port,
    Terrain.CommTower,
    Terrain.LoadedMissileSilo,
    Terrain.MissileSilo,
    Terrain.Lab,
])

const FOUR_TERRAIN_STARS: Set<Terrain> = new Set([Terrain.HQ, Terrain.Mountain])

export function getTerrainStars(terrain: Terrain): number {
    if (ZERO_TERRAIN_STARS.has(terrain)) {
        return 0
    } else if (ONE_TERRAIN_STARS.has(terrain)) {
        return 1
    } else if (TWO_TERRAIN_STARS.has(terrain)) {
        return 2
    } else if (THREE_TERRAIN_STARS.has(terrain)) {
        return 3
    } else if (FOUR_TERRAIN_STARS.has(terrain)) {
        return 4
    }
    throw Error("Unreachable statement")
}

export function getUnitCost(unit: UnitType): number {
    return {
        [UnitType.APC]: 5000,
        [UnitType.Antiair]: 8000,
        [UnitType.Artillery]: 6000,
        [UnitType.BCopter]: 9000,
        [UnitType.Battleship]: 28000,
        [UnitType.BlackBoat]: 7500,
        [UnitType.BlackBomb]: 25000,
        [UnitType.Bomber]: 22000,
        [UnitType.Carrier]: 30000,
        [UnitType.Cruiser]: 18000,
        [UnitType.Fighter]: 20000,
        [UnitType.Infantry]: 1000,
        [UnitType.Lander]: 12000,
        [UnitType.MdTank]: 16000,
        [UnitType.Mech]: 3000,
        [UnitType.MegaTank]: 28000,
        [UnitType.Missile]: 12000,
        [UnitType.Neotank]: 22000,
        [UnitType.Piperunner]: 20000,
        [UnitType.Recon]: 4000,
        [UnitType.Rocket]: 15000,
        [UnitType.Stealth]: 24000,
        [UnitType.Submarine]: 20000,
        [UnitType.TCopter]: 5000,
        [UnitType.Tank]: 7000
    }[unit]
}