import { buildCalculatorToggleButtonHtml } from "./html";
import { AWBWBuildingsInfo, AWBWPlayersInfo, AWBWTerrainInfo, AWBWUnit } from "src/common/awbw_types";

declare const playersInfo: AWBWPlayersInfo
declare const terrainInfo: AWBWTerrainInfo
declare const buildingsInfo: AWBWBuildingsInfo

/*
interface CalculatorUI {
    is_visible: boolean,
    is_dragging: boolean,
    is_attacker_keypress_down: boolean,
    is_defender_keypress_down: boolean,
    window_location: [number, number]
}

interface CalculatorState {
    combat: Combat,
    ui: CalculatorUI
}*/

/*
function code i wrote for obj translation that ended up not working(attackerUnit: AWBWUnit, defenderUnit: AWBWUnit, endTile: number): Promise<MockedAxiosResponse> {
    const parsed_players_info = parsePlayersInfo(playersInfo)

    const width = Object.keys(terrainInfo).length - 1;
    const end_tile_x = endTile % width;
    const end_tile_y = (endTile - end_tile_x) / width;

    const attacker_terrain = getTerrain(terrainInfo, buildingsInfo, end_tile_x, end_tile_y)
    const defender_terrain = getTerrain(terrainInfo, buildingsInfo, defenderUnit.units_x, defenderUnit.units_y)
    const attacker: CombatParticipant = parseAWBWUnit(parsed_players_info, attacker_terrain, attackerUnit)
    const defender: CombatParticipant = parseAWBWUnit(parsed_players_info, defender_terrain, defenderUnit)

    const combat: Combat = {
        attacker: attacker,
        defender: defender,
        combatModifiers: {}
    }

    return new Promise((resolve, _reject) => {
        resolve(calculateDamage2(combat))
    });
}

function calculateDamage2(combat: Combat): MockedAxiosResponse {
    // todo: account for pre-existing chip
    const first_combat_damage = calculateCombatDamage(combat);

    if (INDIRECT_UNITS.has(combat.attacker.unit) || INDIRECT_UNITS.has(combat.defender.unit)) {
        return {
            data: {
                maxInfo: first_combat_damage[first_combat_damage.length - 1],
                minInfo: first_combat_damage[0],
                maxCounterInfo: 0,
                minCounterInfo: 0
            }
        }
    }

    const first_combat_vd_and_chip = damageToVisualDamageAndChip(first_combat_damage)
    const defender_resulting_hp = calculateResultingHp([combat.defender.visualHp, ZERO_CHIP_DAMAGE], first_combat_vd_and_chip)

    const counterattack_combat: Combat = {
        attacker: combat.attacker,
        defender: {
            ...combat.defender,
            visualHp: defender_resulting_hp[0]
        },
        combatModifiers: {
            ...combat.combatModifiers,
            isCounterattack: true
        }
    }
    const counterattack_combat_damage = calculateCombatDamage(counterattack_combat)

    return {
        data: {
            maxInfo: first_combat_damage[first_combat_damage.length - 1],
            minInfo: first_combat_damage[0],
            maxCounterInfo: counterattack_combat_damage[counterattack_combat_damage.length - 1],
            minCounterInfo: counterattack_combat_damage[0]
        }
    }
}*/

function getCalculatorButton(doc: Document): Element {
    const elements = doc.getElementsByClassName("calculator-toggle")
    if (elements.length != 1) {
        throw new Error("cannot locate calculator button");
    }
    return elements[0];
}

function init(doc: Document) {
    const button = buildCalculatorToggleButtonHtml(doc)
    const calc_button = getCalculatorButton(doc);
    calc_button.after(button);
}

function onLoad() {
    init(document)
}

window.addEventListener("load", onLoad)

/*
const state: CalculatorState = {
    combat: {
        attacker: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.None,
            visualHp: 10,
            terrain: Terrain.Plains,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0
        },
        defender: {
            co: CO.Andy,
            unit: UnitType.Infantry,
            cop: COPowerType.None,
            visualHp: 10,
            terrain: Terrain.Plains,
            numCommTowers: 0,
            numCities: 0,
            currentGold: 0
        },
        combatModifiers: {}
    },
    ui: {
        is_visible: false,
        is_attacker_keypress_down: false,
        is_defender_keypress_down: false,
        window_location: [0, 0],
        is_dragging: false
    }
}*/