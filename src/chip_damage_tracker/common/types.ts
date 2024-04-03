export type Coordinate = number;
export type BoardLocation = [Coordinate, Coordinate];
export type BoardLocationKey = string;
export type UnitId = string;

// move these
export type PointInTime = number;
export type ChipDamage = [number, number];
export type LocationToUnitIdMap = Map<BoardLocationKey, UnitId>
export type UnitIdToChipDamageMap = Map<UnitId, ChipDamage>
export function calcBoardLocationKey(loc: BoardLocation): BoardLocationKey {
    return `${loc[0]},${loc[1]}`
}

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
    StealthBomber = 30,
    BlackBomb = 968731,
    BlackBoat = 28,
    Lander = 17,
    Cruiser = 16,
    Submarine = 18,
    Battleship = 15,
    Carrier = 29
}

export const DIRECT_UNITS: Set<UnitType> = new Set([
    UnitType.Recon, UnitType.Tank, UnitType.Antiair, UnitType.MdTank, 
    UnitType.Neotank, UnitType.MegaTank, UnitType.BCopter, UnitType.Fighter, 
    UnitType.Bomber, UnitType.StealthBomber, UnitType.Submarine, UnitType.Cruiser
])

export const INDIRECT_UNITS: Set<UnitType> = new Set([
    UnitType.Artillery, UnitType.Rocket, UnitType.Missile,
    UnitType.Battleship, UnitType.Carrier, UnitType.Piperunner
])

export const INFANTRY_UNITS: Set<UnitType> = new Set([
    UnitType.Infantry, UnitType.Mech
])

export const VEHICLE_UNITS: Set<UnitType> = new Set([
    UnitType.Recon, UnitType.Artillery, UnitType.Tank, UnitType.Antiair,
    UnitType.MdTank, UnitType.Neotank, UnitType.MegaTank, UnitType.Missile,
    UnitType.Piperunner, UnitType.Rocket, UnitType.APC
])

export const NAVAL_UNITS: Set<UnitType> = new Set([
    UnitType.BlackBoat, UnitType.Lander, UnitType.Submarine,
    UnitType.Cruiser, UnitType.Battleship, UnitType.Carrier
])

export const AIR_UNITS: Set<UnitType> = new Set([
    UnitType.Infantry, UnitType.Mech
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
    UnitType.StealthBomber,
    UnitType.BlackBomb,
    UnitType.BlackBoat,
    UnitType.Lander,
    UnitType.Cruiser,
    UnitType.Submarine,
    UnitType.Battleship,
    UnitType.Carrier
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
    VonBolt = 30
}

export enum COPowerType {
    None,
    COP,
    SCOP
}

export enum Terrain {
    Plains,
    Mountain,
    Forest,
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
    ComTower,
    Lab,
    Pipe,
    BrokenPipe,
    MissileSilo
}

export const URBAN_TERRAIN: Set<Terrain> = new Set([
    Terrain.HQ, Terrain.Base, Terrain.Airport,
    Terrain.City, Terrain.Lab, Terrain.ComTower
])

const ZERO_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.River, Terrain.Road, Terrain.Bridge,
    Terrain.Sea, Terrain.Shoal, Terrain.Pipe
])

const ONE_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.Plains, Terrain.Reef, Terrain.BrokenPipe
])

const TWO_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.Forest
])

const THREE_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.City, Terrain.Base, Terrain.Airport, Terrain.Port,
    Terrain.ComTower, Terrain.MissileSilo, Terrain.Lab
])

const FOUR_TERRAIN_STARS: Set<Terrain> = new Set([
    Terrain.Mountain
])

export function getTerrainStars(terrain: Terrain): number {
    if (ZERO_TERRAIN_STARS.has(terrain)) {
        return 0;
    } else if (ONE_TERRAIN_STARS.has(terrain)) {
        return 1;
    } else if (TWO_TERRAIN_STARS.has(terrain)) {
        return 2;
    } else if (THREE_TERRAIN_STARS.has(terrain)) {
        return 3;
    } else if (FOUR_TERRAIN_STARS.has(terrain)) {
        return 4;
    }
    throw Error("Unreachable statement");
}
