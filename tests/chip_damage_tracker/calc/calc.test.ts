import {
    getBaseAmmolessDamage,
    getBaseDamage,
} from "src/chip_damage_tracker/calc/base_damage_map"
import { calculateCombatResult } from "src/chip_damage_tracker/calc/calc"
import { getAttackValue } from "src/chip_damage_tracker/calc/get_attack_value"
import { getDefenseValue } from "src/chip_damage_tracker/calc/get_defense_value"
import {
    Combat,
    CombatModifiers,
    CombatParticipant,
} from "src/chip_damage_tracker/calc/types"
import {
    CO,
    COPowerType,
    Terrain,
    UnitType,
} from "src/chip_damage_tracker/common/types"

test("calculator sanity test", () => {
    const combat: Combat = {
        attacker: {
            co: CO.Adder,
            unit: UnitType.Tank,
            cop: COPowerType.None,
            visualHp: 9,
            terrain: Terrain.City,
            numComTowers: 1,
            numCities: 0,
            currentGold: 0,
        },
        defender: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.SCOP,
            visualHp: 10,
            terrain: Terrain.MissileSilo,
            numComTowers: 0,
            numCities: 0,
            currentGold: 0,
        },
        combatModifiers: {},
    }

    const combat_result = calculateCombatResult(combat)
    expect(combat_result.length).toBe(10)
    expect(combat_result[0]).toBe(44)
    expect(combat_result[9]).toBe(49)
})

test("get attack value sanity test", () => {
    const attacker: CombatParticipant = {
        co: CO.Hawke,
        unit: UnitType.Tank,
        cop: COPowerType.None,
        visualHp: 9,
        terrain: Terrain.City,
        numComTowers: 1,
        numCities: 0,
        currentGold: 0,
    }
    const combatModifiers: CombatModifiers = {}

    const attack_value = getAttackValue(attacker, combatModifiers)
    expect(attack_value).toBe(120)
})

test("get defense value sanity test", () => {
    const defender: CombatParticipant = {
        co: CO.Javier,
        unit: UnitType.Tank,
        cop: COPowerType.COP,
        visualHp: 10,
        terrain: Terrain.Plains,
        numComTowers: 2,
        numCities: 0,
        currentGold: 0,
    }
    const combatModifiers: CombatModifiers = {
        isDefendingAgainstIndirect: true,
    }

    const defense_value = getDefenseValue(defender, combatModifiers)
    expect(defense_value).toBe(190)
})

test("get base damage value sanity test", () => {
    const bcopter_vs_recon = getBaseDamage(UnitType.BCopter, UnitType.Recon)
    const ammoless_bcopter_vs_recon = getBaseAmmolessDamage(
        UnitType.BCopter,
        UnitType.Recon,
    )

    expect(bcopter_vs_recon).toBe(55)
    expect(ammoless_bcopter_vs_recon).toBe(30)
})

test("lash SCOP doubles terrain stars", () => {
    const lash: CombatParticipant = {
        co: CO.Lash,
        unit: UnitType.Tank,
        cop: COPowerType.SCOP,
        visualHp: 10,
        terrain: Terrain.HQ,
        numComTowers: 1,
        numCities: 1,
        currentGold: 1000,
    }
    const sami: CombatParticipant = {
        co: CO.Sami,
        unit: UnitType.Tank,
        cop: COPowerType.None,
        visualHp: 10,
        terrain: Terrain.Plains,
        numComTowers: 1,
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

    const lash_attacks_combat_result = calculateCombatResult(lash_attacks)
    expect(lash_attacks_combat_result.length).toBe(10)
    expect(lash_attacks_combat_result[0]).toBe(99)
    expect(lash_attacks_combat_result[9]).toBe(107)

    const lash_defends_combat_result = calculateCombatResult(lash_defends)
    expect(lash_defends_combat_result.length).toBe(10)
    expect(lash_defends_combat_result[0]).toBe(5)
    expect(lash_defends_combat_result[9]).toBe(6)
})
