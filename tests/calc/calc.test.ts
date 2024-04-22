import { calculateCombatDamage } from "src/calc/calc"
import { Combat, CombatParticipant } from "src/calc/types"
import { addChipDamages } from "src/calc/utils/utils"
import { CO, UnitType, COPowerType, Terrain } from "src/common/types"

test("calculator sanity test", () => {
    const combat: Combat = {
        attacker: {
            co: CO.Adder,
            unit: UnitType.Tank,
            cop: COPowerType.None,
            visualHp: 9,
            terrain: Terrain.City,
            numCommTowers: 1,
            numCities: 0,
            currentGold: 0,
        },
        defender: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.SCOP,
            visualHp: 10,
            terrain: Terrain.MissileSilo,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0,
        },
        combatModifiers: {},
    }

    const combat_result = calculateCombatDamage(combat)
    expect(combat_result.length).toBe(10)
    expect(combat_result[0]).toBe(44)
    expect(combat_result[9]).toBe(49)
})

test("lash SCOP doubles terrain stars", () => {
    const lash: CombatParticipant = {
        co: CO.Lash,
        unit: UnitType.Tank,
        cop: COPowerType.SCOP,
        visualHp: 10,
        terrain: Terrain.HQ,
        numCommTowers: 1,
        numCities: 1,
        currentGold: 1000,
    }
    const sami: CombatParticipant = {
        co: CO.Sami,
        unit: UnitType.Tank,
        cop: COPowerType.None,
        visualHp: 10,
        terrain: Terrain.Plains,
        numCommTowers: 1,
        numCities: 1,
        currentGold: 1000,
    }

    const lash_attacks: Combat = {
        attacker: lash,
        defender: sami,
        combatModifiers: {},
    }
    const lash_defends: Combat = {
        attacker: sami,
        defender: lash,
        combatModifiers: {},
    }

    const lash_attacks_combat_result = calculateCombatDamage(lash_attacks)
    expect(lash_attacks_combat_result.length).toBe(10)
    expect(lash_attacks_combat_result[0]).toBe(99)
    expect(lash_attacks_combat_result[9]).toBe(107)

    const lash_defends_combat_result = calculateCombatDamage(lash_defends)
    expect(lash_defends_combat_result.length).toBe(10)
    expect(lash_defends_combat_result[0]).toBe(5)
    expect(lash_defends_combat_result[9]).toBe(6)
})

test("zero hp attacker does zero damage", () => {
    const combat: Combat = {
        attacker: {
            co: CO.Adder,
            unit: UnitType.MegaTank,
            cop: COPowerType.None,
            visualHp: 0,
            terrain: Terrain.HQ,
            numCommTowers: 10,
            numCities: 0,
            currentGold: 0,
        },
        defender: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.SCOP,
            visualHp: 10,
            terrain: Terrain.Road,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0,
        },
        combatModifiers: {},
    }

    const combat_result = calculateCombatDamage(combat)
    expect(combat_result.length).toBe(10)
    expect(combat_result[0]).toBe(0)
    expect(combat_result[9]).toBe(0)
})

test("luck attacker have wider variance", () => {
    const combat: Combat = {
        attacker: {
            co: CO.Jugger,
            unit: UnitType.Infantry,
            cop: COPowerType.SCOP,
            visualHp: 10,
            terrain: Terrain.Road,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0,
        },
        defender: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.None,
            visualHp: 10,
            terrain: Terrain.Road,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0,
        },
        combatModifiers: {},
    }

    const combat_result = calculateCombatDamage(combat)
    expect(combat_result.length).toBe(45 * 95)
})
