import { hpRange } from "src/calc/hp_distribution"
import { CO, Terrain, UnitType } from "src/common/types"
import { ReplayPlayer, ReplayTurn, ReplayUnit } from "src/tracker/replay_types"
import { trackTrueHp } from "src/tracker/true_hp_tracker"

const PLAYER_A = 1
const PLAYER_B = 2

function player(id: number): ReplayPlayer {
    return {
        players_id: id,
        players_co_id: CO.Andy,
        players_co_power_on: "N",
        players_funds: 0,
        cities: 0,
        towers: 0,
    }
}

function tank(id: number, playerId: number, x: number, hp = 10): ReplayUnit {
    return {
        units_id: id,
        units_players_id: playerId,
        generic_id: UnitType.Tank,
        units_hit_points: hp,
        units_ammo: 9,
        units_x: x,
        units_y: 0,
    }
}

const plains = () => Terrain.Plains

const day_one: ReplayTurn = {
    day: 1,
    units: [tank(10, PLAYER_A, 0), tank(20, PLAYER_B, 1)],
    players: [player(PLAYER_A), player(PLAYER_B)],
    actions: [
        {
            action: "Fire",
            attacker: {
                units_id: 10,
                units_hit_points: 8,
                units_ammo: 8,
                units_x: 0,
                units_y: 0,
            },
            defender: {
                units_id: 20,
                units_hit_points: 5,
                units_ammo: 8,
                units_x: 1,
                units_y: 0,
            },
        },
    ],
}

test("fire narrows both units to luck rolls matching visual HP", () => {
    const { distributions, resets } = trackTrueHp([day_one], plains)

    const defender = distributions.get(20)!
    expect(hpRange(defender)).toEqual([43, 50])
    expect(defender[46]).toBeCloseTo(2 / 9)
    expect(defender[50]).toBeCloseTo(1 / 9)

    const attacker = distributions.get(10)!
    expect(hpRange(attacker)).toEqual([72, 76])
    expect(attacker[73]).toBeCloseTo(3 / 10)
    expect(resets).toEqual([])
})

test("repairs, powers, builds and deaths carry across turns", () => {
    const day_two: ReplayTurn = {
        day: 2,
        units: [
            tank(10, PLAYER_A, 0, 8),
            tank(20, PLAYER_B, 1, 7),
            tank(30, PLAYER_B, 2),
        ],
        players: [player(PLAYER_A), player(PLAYER_B)],
        actions: [
            {
                action: "Power",
                playerId: PLAYER_A,
                coPower: "Y",
                unitReplace: {
                    units: [
                        { units_id: 20, units_hit_points: 6 },
                        { units_id: 30, units_hit_points: 9 },
                    ],
                },
            },
            { action: "Build", newUnit: tank(40, PLAYER_A, 3) },
        ],
    }
    const day_three: ReplayTurn = {
        day: 3,
        units: [tank(20, PLAYER_B, 1, 6), tank(40, PLAYER_A, 3)],
        players: [player(PLAYER_A), player(PLAYER_B)],
        actions: [],
    }

    const { distributions, resets } = trackTrueHp(
        [day_one, day_two, day_three],
        plains,
    )

    expect(hpRange(distributions.get(20)!)).toEqual([53, 60])
    expect(distributions.get(40)![100]).toBe(1)
    expect(distributions.has(10)).toBe(false)
    expect(distributions.has(30)).toBe(false)
    expect(resets).toEqual([])
})

test("unexplained HP falls back to uniform and is reported", () => {
    const day_two: ReplayTurn = {
        day: 2,
        units: [tank(10, PLAYER_A, 0, 8), tank(20, PLAYER_B, 1, 5)],
        players: [player(PLAYER_A), player(PLAYER_B)],
        actions: [
            {
                action: "Fire",
                attacker: {
                    units_id: 20,
                    units_hit_points: 5,
                    units_ammo: 7,
                    units_x: 1,
                    units_y: 0,
                },
                defender: {
                    units_id: 10,
                    units_hit_points: 1,
                    units_ammo: 7,
                    units_x: 0,
                    units_y: 0,
                },
            },
        ],
    }

    const { distributions, resets } = trackTrueHp([day_one, day_two], plains)

    expect(hpRange(distributions.get(10)!)).toEqual([1, 10])
    expect(resets).toMatchObject([{ day: 2, unitId: 10, reason: "fire" }])
})

test("powers with overlapping hits use each unclipped step", () => {
    const day_two: ReplayTurn = {
        day: 2,
        units: [
            tank(10, PLAYER_A, 0, 8),
            tank(20, PLAYER_B, 1, 5),
            tank(30, PLAYER_B, 2),
            tank(40, PLAYER_B, 3),
            tank(50, PLAYER_B, 4, 3),
        ],
        players: [player(PLAYER_A), player(PLAYER_B)],
        actions: [
            {
                action: "Power",
                playerId: PLAYER_A,
                coPower: "S",
                unitReplace: {
                    units: [
                        { units_id: 10 },
                        { units_id: 30, units_hit_points: 7 },
                        { units_id: 40, units_hit_points: 4 },
                        { units_id: 50, units_hit_points: 1 },
                    ],
                },
            },
        ],
    }

    const { distributions, resets } = trackTrueHp([day_one, day_two], plains)

    expect(hpRange(distributions.get(30)!)).toEqual([61, 70])
    expect(hpRange(distributions.get(40)!)).toEqual([31, 40])
    expect(distributions.get(50)![1]).toBeCloseTo(1)
    expect(hpRange(distributions.get(10)!)).toEqual([72, 76])
    expect(resets).toEqual([])
})
