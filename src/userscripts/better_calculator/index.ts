import {
    HpDistribution,
    likelihoodOfVisualHp,
    mostLikelyHp,
    pointMass,
} from "src/calc/hp_distribution"
import { parseAWBWCalculatorSide } from "src/calc/utils/awbw_utils"
import {
    AWBWBuildingsInfo,
    AWBWCalculator,
    AWBWCalculatorSideName,
    AWBWTerrainInfo,
} from "src/common/awbw_types"
import { getTerrain } from "src/common/awbw_utils"
import { Terrain } from "src/common/types"
import { loadReplayTurns } from "src/tracker/replay_loader"
import { trackTrueHp } from "src/tracker/true_hp_tracker"
import { computeCombatResult } from "./combat_result"
import {
    SideView,
    buildTrueHpPanel,
    getTrueHpInput,
    injectTrueHpPanelStyles,
    renderTrueHp,
} from "./html"
import { CombatResult } from "./model"

declare const terrainInfo: AWBWTerrainInfo
declare const buildingsInfo: AWBWBuildingsInfo

interface SideState {
    unitId: number | null
    override: number | null
}

const SIDES: AWBWCalculatorSideName[] = ["attacker", "defender"]

function getVisualHp(calculator: AWBWCalculator, side: AWBWCalculatorSideName) {
    return Number(calculator[side].hp)
}

function getGameId(): number | null {
    const id = Number(new URLSearchParams(location.search).get("games_id"))
    return Number.isInteger(id) && id > 0 ? id : null
}

function lookupTerrain(x: number, y: number): Terrain {
    try {
        return getTerrain(terrainInfo, buildingsInfo, x, y)
    } catch {
        return Terrain.Plains
    }
}

function init(doc: Document): void {
    const calculator = (window as any).calculator as AWBWCalculator | undefined
    const calculator_window = doc.getElementById("calculator")
    if (!calculator || !calculator_window) {
        console.warn("[better_calculator] AWBW calculator not found")
        return
    }

    const state: Record<AWBWCalculatorSideName, SideState> = {
        attacker: { unitId: null, override: null },
        defender: { unitId: null, override: null },
    }
    let tracked: Map<number, HpDistribution> | null = null
    let status = "True HP tracking: starting"

    injectTrueHpPanelStyles(doc)
    const panel = buildTrueHpPanel(doc)
    calculator_window.appendChild(panel)

    function sideView(side: AWBWCalculatorSideName): SideView {
        const visual_hp = getVisualHp(calculator!, side)
        const { unitId, override } = state[side]
        if (override !== null && Math.ceil(override / 10) === visual_hp) {
            return {
                inputValue: override,
                distribution: pointMass(override),
                source: "set",
            }
        }
        state[side].override = null
        const distribution = unitId !== null ? tracked?.get(unitId) : undefined
        if (
            distribution &&
            likelihoodOfVisualHp(distribution, visual_hp) > 0.99
        ) {
            return {
                inputValue: mostLikelyHp(distribution),
                distribution,
                source: "tracked",
            }
        }
        return {
            inputValue: visual_hp * 10,
            distribution: pointMass(visual_hp * 10),
            source: "assumed",
        }
    }

    function update(): void {
        const attacker = sideView("attacker")
        const defender = sideView("defender")

        let result: CombatResult | null = null
        try {
            result = computeCombatResult(
                {
                    attacker: parseAWBWCalculatorSide(calculator!.attacker),
                    defender: parseAWBWCalculatorSide(calculator!.defender),
                    combatModifiers: {},
                },
                attacker.distribution,
                defender.distribution,
            )
        } catch (e) {
            console.warn("[better_calculator] could not compute combat", e)
        }

        if (!panel.isConnected) {
            calculator_window!.appendChild(panel)
        }
        renderTrueHp(panel, attacker, defender, result, status)
    }

    const add_unit_to_calc = calculator.addUnitToCalc
    calculator.addUnitToCalc = (side, unitId) => {
        state[side] = { unitId: Number(unitId), override: null }
        return add_unit_to_calc(side, unitId)
    }

    const swap_position = calculator.swapPosition
    calculator.swapPosition = () => {
        const attacker = state.attacker
        state.attacker = state.defender
        state.defender = attacker
        return swap_position()
    }

    for (const side of SIDES) {
        getTrueHpInput(panel, side).addEventListener("change", (e) => {
            const input = e.target as HTMLInputElement
            const true_hp = Math.min(
                100,
                Math.max(1, Math.round(Number(input.value))),
            )
            if (Number.isNaN(true_hp)) {
                update()
                return
            }
            state[side].override = true_hp
            const visual_hp = Math.ceil(true_hp / 10)
            if (visual_hp !== getVisualHp(calculator, side)) {
                calculator[side].hp = visual_hp
                calculator.updateDamage()
            }
            update()
        })
    }

    calculator.$watch(
        () => [calculator.attacker, calculator.defender],
        update,
        {
            deep: true,
        },
    )
    update()

    const game_id = getGameId()
    if (game_id === null) {
        status = "True HP tracking: no game id"
        update()
        return
    }
    loadReplayTurns(game_id, (day) => {
        status = `True HP tracking: loading day ${day}`
        update()
    })
        .then((turns) => {
            const result = trackTrueHp(turns, lookupTerrain)
            tracked = result.distributions
            const day = turns.length > 0 ? turns[turns.length - 1].day : 0
            status = `True HP tracked through day ${day}`
            if (result.resets.length > 0) {
                console.info(
                    "[better_calculator] tracker resets",
                    result.resets,
                )
            }
            update()
        })
        .catch((e) => {
            console.warn("[better_calculator] true HP tracking failed", e)
            status = "True HP tracking: unavailable"
            update()
        })
}

window.addEventListener("load", () => init(document))
