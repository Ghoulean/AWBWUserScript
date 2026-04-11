import { Combat, CombatParticipant } from "src/calc/types"
import { parseAWBWUnit } from "src/calc/utils/awbw_utils"
import { parsePlayersInfo, getTerrain } from "src/common/awbw_utils"
import {
    buildCalculatorToggleButtonHtml,
    buildCalculatorWindowHtml,
    injectCalculatorStyles,
    updateAttackerDamageDisplay,
    updateCounterattackDisplay,
} from "./html"
import {
    AWBWBuildingsInfo,
    AWBWPlayersInfo,
    AWBWTerrainInfo,
    AWBWUnit,
} from "src/common/awbw_types"
import { CombatResult, CounterattackScenario, DamageResult } from "./model"
import { calculateCombatDamage } from "src/calc/calc"
import {
    getBaseDamage,
    getBaseAmmolessDamage,
} from "src/calc/utils/base_damage_map"
import { getUnitCost } from "src/common/utils"
import { INDIRECT_UNITS } from "src/common/types"

declare const playersInfo: AWBWPlayersInfo
declare const terrainInfo: AWBWTerrainInfo
declare const buildingsInfo: AWBWBuildingsInfo

let calculator_window: Element | null = null

function computeCombatResult(combat: Combat): CombatResult {
    const primary_damage = calculateCombatDamage(combat)
    const min_damage = primary_damage[0]
    const max_damage = primary_damage[primary_damage.length - 1]

    const defender_cost = getUnitCost(combat.defender.unit) ?? 0
    const attacker_cost = getUnitCost(combat.attacker.unit) ?? 0

    const attackerDamage: DamageResult = {
        minDamage: min_damage,
        maxDamage: max_damage,
        minFundsDamage: Math.floor((min_damage * defender_cost) / 100),
        maxFundsDamage: Math.floor((max_damage * defender_cost) / 100),
    }

    const is_direct = !INDIRECT_UNITS.has(combat.attacker.unit)
    const defender_can_retaliate =
        getBaseDamage(combat.defender.unit, combat.attacker.unit) > 0 ||
        getBaseAmmolessDamage(combat.defender.unit, combat.attacker.unit) > 0

    if (!is_direct || !defender_can_retaliate) {
        return {
            attackerDamage,
            counterattackAtMinDamage: null,
            counterattackAtMaxDamage: null,
        }
    }

    const max_defender_true_hp = combat.defender.visualHp * 10

    function computeCounterattack(
        primary_damage_taken: number,
    ): CounterattackScenario | null {
        const remaining_true_hp = max_defender_true_hp - primary_damage_taken
        if (remaining_true_hp <= 0) return null

        const remaining_visual_hp = Math.ceil(remaining_true_hp / 10)
        const counter_combat: Combat = {
            attacker: { ...combat.defender, visualHp: remaining_visual_hp },
            defender: combat.attacker,
            combatModifiers: { isCounterattack: true },
        }
        const counter_damage = calculateCombatDamage(counter_combat)

        return {
            visualHp: remaining_visual_hp,
            minDamage: counter_damage[0],
            maxDamage: counter_damage[counter_damage.length - 1],
            minFundsDamage: Math.floor(
                (counter_damage[0] * attacker_cost) / 100,
            ),
            maxFundsDamage: Math.floor(
                (counter_damage[counter_damage.length - 1] * attacker_cost) /
                    100,
            ),
        }
    }

    return {
        attackerDamage,
        counterattackAtMinDamage: computeCounterattack(min_damage),
        counterattackAtMaxDamage: computeCounterattack(max_damage),
    }
}

// Called by AWBW's calculator when the user initiates an attack.
// endTile is the flat tile index of the destination (attacker's landing tile).
function calculateDamage(
    attackerUnit: AWBWUnit,
    defenderUnit: AWBWUnit,
    endTile: number,
): Promise<CombatResult> {
    const parsed_players_info = parsePlayersInfo(playersInfo)

    const width = Object.keys(terrainInfo).length - 1
    const end_tile_x = endTile % width
    const end_tile_y = (endTile - end_tile_x) / width

    const attacker_terrain = getTerrain(
        terrainInfo,
        buildingsInfo,
        end_tile_x,
        end_tile_y,
    )
    const defender_terrain = getTerrain(
        terrainInfo,
        buildingsInfo,
        defenderUnit.units_x,
        defenderUnit.units_y,
    )
    const attacker: CombatParticipant = parseAWBWUnit(
        parsed_players_info,
        attacker_terrain,
        attackerUnit,
    )
    const defender: CombatParticipant = parseAWBWUnit(
        parsed_players_info,
        defender_terrain,
        defenderUnit,
    )

    const combat: Combat = {
        attacker,
        defender,
        combatModifiers: {},
    }

    const result = computeCombatResult(combat)
    displayResult(result)
    return Promise.resolve(result)
}

function displayResult(result: CombatResult): void {
    if (!calculator_window) return
    updateAttackerDamageDisplay(calculator_window, result.attackerDamage)
    updateCounterattackDisplay(
        calculator_window,
        result.counterattackAtMinDamage,
        result.counterattackAtMaxDamage,
    )
}

function getCalculatorButton(doc: Document): Element {
    const elements = doc.getElementsByClassName("calculator-toggle")
    if (elements.length != 1) {
        throw new Error("cannot locate calculator button")
    }
    return elements[0]
}

function setupDrag(win: HTMLElement): void {
    const header = win.querySelector(".grab-header") as HTMLElement | null
    if (!header) return

    let is_dragging = false
    let drag_offset_x = 0
    let drag_offset_y = 0

    header.addEventListener("mousedown", (e: MouseEvent) => {
        is_dragging = true
        const rect = win.getBoundingClientRect()
        drag_offset_x = e.clientX - rect.left
        drag_offset_y = e.clientY - rect.top
        header.style.cursor = "grabbing"
    })
    document.addEventListener("mousemove", (e: MouseEvent) => {
        if (!is_dragging) return
        win.style.left = `${e.clientX - drag_offset_x}px`
        win.style.top = `${e.clientY - drag_offset_y}px`
    })
    document.addEventListener("mouseup", () => {
        if (is_dragging) {
            is_dragging = false
            header.style.cursor = "grab"
        }
    })
}

function init(doc: Document): void {
    injectCalculatorStyles(doc)

    calculator_window = buildCalculatorWindowHtml(doc)
    doc.body.appendChild(calculator_window)

    setupDrag(calculator_window as HTMLElement)

    const close_btn = calculator_window.querySelector(".close-calc")
    if (close_btn) {
        close_btn.addEventListener("click", () => {
            ;(calculator_window as HTMLElement).style.display = "none"
        })
    }

    // Swap: recompute with attacker/defender reversed. Since we don't yet
    // maintain local state for the selected units, this is a no-op for now.
    // TODO: wire up once unit selection state is tracked.

    const toggle_button = buildCalculatorToggleButtonHtml(doc)
    const calc_button = getCalculatorButton(doc)
    calc_button.after(toggle_button)

    toggle_button.addEventListener("click", () => {
        const win = calculator_window as HTMLElement
        win.style.display = win.style.display === "none" ? "block" : "none"
    })

    // Expose calculateDamage so AWBW's calculator can call it.
    // With @grant none the userscript runs in page context, so this directly
    // overrides any existing page-level calculateDamage function.
    ;(window as any).calculateDamage = calculateDamage
}

window.addEventListener("load", () => init(document))
