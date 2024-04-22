export type Coordinate = number
export type BoardLocation = [Coordinate, Coordinate]
export type BoardLocationKey = string
export type UnitId = string

// todo: enumify
export type Country = number;

export enum UnitType {
    Infantry = 1,
    Mech = 2,
    Recon = 5,
    APC = 6,
    Artillery = 7,
    Tank = 4,
    Antiair = 9,
    Missile = 10,
    Rocket = 8,
    MdTank = 3,
    Piperunner = 960900,
    Neotank = 46,
    MegaTank = 1141438,
    TCopter = 14,
    BCopter = 13,
    Fighter = 11,
    Bomber = 12,
    Stealth = 30,
    BlackBomb = 968731,
    BlackBoat = 28,
    Lander = 17,
    Cruiser = 16,
    Submarine = 18,
    Battleship = 15,
    Carrier = 29,
}

export const DIRECT_UNITS: Set<UnitType> = new Set([
    UnitType.Recon,
    UnitType.Tank,
    UnitType.Antiair,
    UnitType.MdTank,
    UnitType.Neotank,
    UnitType.MegaTank,
    UnitType.BCopter,
    UnitType.Fighter,
    UnitType.Bomber,
    UnitType.Stealth,
    UnitType.Submarine,
    UnitType.Cruiser,
])

export const INDIRECT_UNITS: Set<UnitType> = new Set([
    UnitType.Artillery,
    UnitType.Rocket,
    UnitType.Missile,
    UnitType.Battleship,
    UnitType.Carrier,
    UnitType.Piperunner,
])

export const INFANTRY_UNITS: Set<UnitType> = new Set([
    UnitType.Infantry,
    UnitType.Mech,
])

export const VEHICLE_UNITS: Set<UnitType> = new Set([
    UnitType.Recon,
    UnitType.Artillery,
    UnitType.Tank,
    UnitType.Antiair,
    UnitType.MdTank,
    UnitType.Neotank,
    UnitType.MegaTank,
    UnitType.Missile,
    UnitType.Piperunner,
    UnitType.Rocket,
    UnitType.APC,
])

export const NAVAL_UNITS: Set<UnitType> = new Set([
    UnitType.BlackBoat,
    UnitType.Lander,
    UnitType.Submarine,
    UnitType.Cruiser,
    UnitType.Battleship,
    UnitType.Carrier,
])

export const AIR_UNITS: Set<UnitType> = new Set([
    UnitType.Infantry,
    UnitType.Mech,
])

export const ALL_UNIT_TYPES = [
    UnitType.Infantry,
    UnitType.Mech,
    UnitType.Recon,
    UnitType.APC,
    UnitType.Artillery,
    UnitType.Tank,
    UnitType.Antiair,
    UnitType.Missile,
    UnitType.Rocket,
    UnitType.MdTank,
    UnitType.Piperunner,
    UnitType.Neotank,
    UnitType.MegaTank,
    UnitType.TCopter,
    UnitType.BCopter,
    UnitType.Fighter,
    UnitType.Bomber,
    UnitType.Stealth,
    UnitType.BlackBomb,
    UnitType.BlackBoat,
    UnitType.Lander,
    UnitType.Cruiser,
    UnitType.Submarine,
    UnitType.Battleship,
    UnitType.Carrier,
]

export enum CO {
    Andy = 1,
    Grit = 2,
    Kanbei = 3,
    Drake = 5,
    Max = 7,
    Sami = 8,
    Olaf = 9,
    Eagle = 10,
    Adder = 11,
    Hawke = 12,
    Sensei = 13,
    Jess = 14,
    Colin = 15,
    Lash = 16,
    Hachi = 17,
    Sonja = 18,
    Sasha = 19,
    Grimm = 20,
    Koal = 21,
    Jake = 22,
    Kindle = 23,
    Nell = 24,
    Flak = 25,
    Jugger = 26,
    Javier = 27,
    Rachel = 28,
    Sturm = 29,
    VonBolt = 30,
}

export enum COPowerType {
    None,
    COP,
    SCOP,
}

export enum Terrain {
    Plains,
    Mountain,
    Woods,
    River,
    Road,
    Bridge,
    Sea,
    Shoal,
    Reef,
    City,
    Base,
    Airport,
    Port,
    HQ,
    CommTower,
    Lab,
    Pipe,
    BrokenPipe,
    Pipeseam,
    MissileSilo,
    LoadedMissileSilo,
    Teleporter
}

export const URBAN_TERRAIN: Set<Terrain> = new Set([
    Terrain.HQ,
    Terrain.Base,
    Terrain.Airport,
    Terrain.City,
    Terrain.Lab,
    Terrain.CommTower,
])

// todo: track COP/SCOP price increase
export interface PlayerInfo {
    id: number,
    num: number,
    co: CO,
    cop: COPowerType,
    copMeter: number,
    funds: number,
    numCities: number,
    numCommTowers: number,
}

export interface PlayersInfo {
    [playerId: number]: PlayerInfo
}
