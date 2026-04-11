import { ElementTag, Attribute } from "src/common/html_types"
import calculator_png from "./assets/calculator.png"
import { CounterattackScenario, DamageResult } from "./model"

const CALCULATOR_CSS = `
.attacker-damage,
.defender-damage {
    align-items: center;
    display: flex;
    flex-direction: column;
}
.bold {
    font-weight: bold;
}
.border {
    border: 1px solid #888888;
    background: white;
    cursor: pointer;
}
#calculator {
    background: white;
    border: 1px solid black;
    display: none;
    font-family: sans-serif;
    font-size: 14px;
    left: 200px;
    position: absolute;
    top: 200px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 340px;
    z-index: 800;
}
.calculator-attack,
.calculator-defend {
    align-items: center;
    background: #dddddd;
    border: 1px solid #888888;
    display: flex;
    flex-wrap: wrap;
    margin-top: 4px;
    padding-top: 4px;
    width: 49%;
}
.calculator-damage {
    display: flex;
    justify-content: space-around;
}
.calculator-damage div {
    width: 49%;
}
#calculator header {
    background: #0066cc;
    border: 1px solid #888888;
    color: white;
    font-weight: bold;
    padding: 2px 2px;
}
.calculator-help {
    position: absolute;
    right: 32px;
}
.calculator-help span {
    right: 8px;
    position: absolute;
    width: 150px;
}
.calculator-main {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.co-menu {
    width: 144px;
}
.coin {
    flex-shrink: 0;
}
.defender-hp {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
div[class$="-menu"] {
    align-items: center;
    background: white;
    border: 1px solid #dddddd;
    position: absolute;
    z-index: 10;
}
div[class$="-menu"] img {
    border: 1px solid #888888;
    margin: 1px;
    background: #dddddd;
}
div[class$="-menu"] img:hover {
    transform: scale(1.2);
}
div[class$="-options"] {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 5px;
    margin-top: 4px;
}
div[class="hp-options"],
div[class="city-options"],
div[class="tower-options"],
div[class="fund-options"] {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
div[class="misc-options"] {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 4px;
    width: 92px;
}
div[class="power-options"] {
    align-self: flex-start;
    align-items: center;
    flex-direction: row;
    width: 60px;
}
div[class="ammo-options"] {
    align-self: center;
    align-items: center;
    flex-direction: row;
}
div[class="fund-options"] {
    width: 100%;
}
div[class^="selected-"]:hover,
img[class^="selected-"]:hover {
    cursor: pointer;
    transform: scale(1.2);
}
.fire {
    margin: 2px 0;
}
.fund-options input {
    margin-left: 1px;
    margin-right: 5px;
    overflow: hidden;
    min-width: 40px;
}
.gold-coin {
    margin: 2px 0;
}
.grab-header {
    align-items: center;
    cursor: grab;
    display: flex;
}
.grab-header span {
    cursor: pointer;
    font-size: 16px;
    margin-left: auto;
    margin-right: 8px;
}
.green-border {
    border-color: #29b5e9 !important;
    transform: scale(1.2) !important;
}
.red-border {
    border-color: #e92929 !important;
    border-radius: 25% !important;
    transform: scale(1.2) !important;
}
.red-border-strikethru {
    width: 100%;
    height: 90%;
    display: inline-block;
    position: absolute;
    z-index: 5;
    pointer-events: none;
    border-radius: 15%;
    background: linear-gradient(
        to top right,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 47%,
        rgba(233, 43, 43, 1) 47%,
        rgba(233, 43, 43, 1) 53%,
        rgba(0, 0, 0, 0) 53%,
        rgba(0, 0, 0, 0) 100%
    );
}
.headers {
    display: flex;
    justify-content: space-around;
    margin: 2px 0;
}
.headers header {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    width: 49%;
}
.hp-options img,
.tower-options img {
    width: 9px;
}
.hp-options input,
.city-options input,
.tower-options input {
    margin-left: 2px;
    width: 20px;
}
.hp-display {
    bottom: 4px;
    right: 0;
    position: absolute;
    width: 12px !important;
}
.option {
    margin: 0 5px;
    position: relative;
}
.power-options img {
    border: 2px solid transparent;
    cursor: pointer;
    width: 19px;
}
.power-options img:hover {
    transform: scale(1.2);
}
.ammo-options img {
    border: 2px solid transparent;
    cursor: pointer;
    width: 19px;
}
.ammo-options img:hover {
    transform: scale(1.2);
}
.ammo-reverse-info-box .info-box-text {
    width: 40px;
    right: 20px;
    pointer-events: none;
}
.ammo-reverse-info-box:hover .info-box-text {
    visibility: visible;
}
.select-attacker,
.select-defender {
    right: 2px;
}
.selected-co {
    align-items: center;
    display: flex;
    height: 48px;
    justify-content: center;
    width: 48px;
}
.swap-position,
.select-attacker,
.select-defender {
    cursor: pointer;
    font-size: 10px;
    font-weight: 400;
    position: absolute;
}
.swap-position {
    left: 2px;
}
.swap-position:hover,
.select-attacker:hover,
.select-defender:hover {
    color: #dddddd;
}
.terrain {
    position: absolute;
}
.terrain-menu {
    position: relative;
    width: 112px;
}
.terrain-options {
    align-items: center;
    margin-left: 9px;
    width: 24px;
}
.terrain-stars {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 20px;
    justify-content: center;
    margin-top: auto;
    z-index: 100;
}
.terrain-stars img {
    width: 9px !important;
}
.terrain-stars p {
    margin-left: 3px;
}
.unit img,
.terrain img {
    width: 24px;
}
.unit-menu {
    width: 144px;
}
.unit-options {
    align-items: center;
}
`

const CALCULATOR_WINDOW_HTML = `
<div id="calculator" style="display: none">
    <header class="grab-header" style="cursor: grab">
        Damage calculator
        <div class="reverse-info-box calculator-help">
            ?
            <span class="info-box-text"
                >Hold down "A" or "D" while clicking a unit to add it to the
                calculator</span
            >
        </div>
        <span class="close-calc">&#x2715;</span>
    </header>
    <div class="calc-content">
        <div class="headers">
            <header>
                Attacker <span class="select-attacker"> [Select] </span>
                <span class="swap-position"> [Swap] </span>
            </header>
            <header>
                Defender
                <span class="select-defender"> [Select] </span>
            </header>
        </div>
        <div class="calculator-main">
            <div class="calculator-attack">
                <div class="co-options">
                    <div class="co option">
                        <div class="selected-co">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/aw2andy.png?v=1"
                                class="border co_portrait"
                            />
                        </div>
                    </div>
                </div>
                <div class="unit-options">
                    <div class="unit option">
                        <div class="selected-unit border">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/osinfantry.gif"
                            />
                        </div>
                    </div>
                    <div class="hp-options">
                        <img src="https://awbw.amarriner.com/terrain/hp.gif" />
                        <input type="text" value="10" />
                    </div>
                </div>
                <div class="terrain-options">
                    <div class="terrain option">
                        <img
                            src="https://awbw.amarriner.com/terrain/aw2/plain.gif"
                            class="selected-terrain"
                        />
                        <div class="terrain-stars">
                            <img
                                src="https://awbw.amarriner.com/terrain/terrainstar.gif"
                            />
                            <p>1</p>
                        </div>
                    </div>
                </div>
                <div class="power-and-ammo-container">
                    <div class="power-options">
                        <div class="option">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/redstar.gif"
                                class=""
                            />
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/bluestar.gif"
                                class=""
                            />
                        </div>
                    </div>
                    <div class="ammo-options">
                        <div
                            class="option ammo-reverse-info-box"
                            style="visibility: hidden"
                        >
                            <span class="info-box-text"
                                >Toggle out of ammo</span
                            >
                            <span
                                class="red-border-strikethru"
                                style="display: none"
                            ></span>
                            <img
                                src="https://awbw.amarriner.com/terrain/ammo_button.gif"
                                class=""
                            />
                        </div>
                    </div>
                </div>
                <div class="misc-options">
                    <div class="city-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/capt.gif"
                        />
                        <input type="text" max="100" min="0" value="0" />
                    </div>
                    <div class="tower-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/aw2/commtowericon.gif"
                        />
                        <input type="text" max="100" min="0" value="0" />
                    </div>
                    <div class="fund-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/coin.gif"
                            class="coin"
                        />
                        <input type="text" min="0" value="0" />
                    </div>
                </div>
            </div>
            <div class="calculator-defend">
                <div class="co-options">
                    <div class="co option">
                        <div class="selected-co">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/aw2andy.png?v=1"
                                class="border co_portrait"
                            />
                        </div>
                    </div>
                </div>
                <div class="unit-options">
                    <div class="unit option">
                        <div class="selected-unit border">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/osinfantry.gif"
                            />
                        </div>
                    </div>
                    <div class="hp-options">
                        <img src="https://awbw.amarriner.com/terrain/hp.gif" />
                        <input type="text" max="10" min="1" value="10" />
                    </div>
                </div>
                <div class="terrain-options">
                    <div class="terrain option">
                        <img
                            src="https://awbw.amarriner.com/terrain/aw2/plain.gif"
                            class="selected-terrain"
                        />
                        <div class="terrain-stars">
                            <img
                                src="https://awbw.amarriner.com/terrain/terrainstar.gif"
                            />
                            <p>1</p>
                        </div>
                    </div>
                </div>
                <div class="power-and-ammo-container">
                    <div class="power-options">
                        <div class="option">
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/redstar.gif"
                                class=""
                            />
                            <img
                                src="https://awbw.amarriner.com/terrain/aw2/bluestar.gif"
                                class=""
                            />
                        </div>
                    </div>
                    <div class="ammo-options">
                        <div
                            class="option ammo-reverse-info-box"
                            style="visibility: hidden"
                        >
                            <span class="info-box-text"
                                >Toggle out of ammo</span
                            >
                            <span
                                class="red-border-strikethru"
                                style="display: none"
                            ></span>
                            <img
                                src="https://awbw.amarriner.com/terrain/ammo_button.gif"
                                class=""
                            />
                        </div>
                    </div>
                </div>
                <div class="misc-options">
                    <div class="city-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/capt.gif"
                        />
                        <input type="text" max="100" min="0" value="0" />
                    </div>
                    <div class="tower-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/aw2/commtowericon.gif"
                        />
                        <input type="text" max="100" min="0" value="0" />
                    </div>
                    <div class="fund-options">
                        <img
                            src="https://awbw.amarriner.com/terrain/coin.gif"
                            class="coin"
                        />
                        <input type="text" min="0" value="0" />
                    </div>
                </div>
            </div>
        </div>
        <div class="calculator-damage">
            <div class="attacker-damage">
                <img
                    src="https://awbw.amarriner.com/terrain/fire.gif"
                    class="fire"
                />
                <span class="damage-percent-display"> --% - --% </span>
                <img
                    src="https://awbw.amarriner.com/terrain/coin.gif"
                    class="gold-coin"
                />
                <span class="funds-damage-display">
                    --
                    <span style="display: none"> - -- </span>
                </span>
            </div>
            <div class="defender-damage">
                <img
                    src="https://awbw.amarriner.com/terrain/fire.gif"
                    class="fire"
                />
                <span class="counter-min-display"
                    ><span class="bold">@--HP</span> --% - --%</span
                >
                <span class="counter-max-display" style="display: none"
                    ><span class="bold">@--HP</span> --% - --%</span
                >
                <img
                    src="https://awbw.amarriner.com/terrain/coin.gif"
                    class="gold-coin"
                />
                <span class="funds-damage-display"
                    >-- <span> - --</span></span
                >
            </div>
        </div>
    </div>
</div>
`

export function injectCalculatorStyles(doc: Document): void {
    const style = doc.createElement("style")
    style.textContent = CALCULATOR_CSS
    doc.head.appendChild(style)
}

export function buildCalculatorWindowHtml(doc: Document): Element {
    const container = doc.createElement("div")
    container.innerHTML = CALCULATOR_WINDOW_HTML.trim()
    return container.firstElementChild!
}

export function buildCalculatorToggleButtonHtml(doc: Document): Element {
    const buttonDiv = doc.createElement(ElementTag.DIV)
    buttonDiv.setAttribute(Attribute.CLASS, "game-tools-btn")

    const imageDiv = doc.createElement(ElementTag.DIV)
    imageDiv.setAttribute(Attribute.CLASS, "game-tools-bg")

    const image = doc.createElement(ElementTag.IMG)
    image.setAttribute(Attribute.IMG_SRC, calculator_png)
    image.setAttribute(Attribute.STYLE, "display: block;")

    const tooltip = doc.createElement(ElementTag.DIV)
    tooltip.setAttribute(Attribute.CLASS, "game-tools-btn-text small_text")
    tooltip.innerHTML = "Better Calculator"

    buttonDiv.append(imageDiv, tooltip)
    imageDiv.append(image)

    return buttonDiv
}

export function updateAttackerDamageDisplay(
    calculator_window: Element,
    damage: DamageResult,
): void {
    const pct = calculator_window.querySelector(
        ".attacker-damage .damage-percent-display",
    ) as HTMLElement | null
    if (pct) {
        pct.textContent = ` ${damage.minDamage}% - ${damage.maxDamage}% `
    }

    const funds = calculator_window.querySelector(
        ".attacker-damage .funds-damage-display",
    ) as HTMLElement | null
    if (funds) {
        if (damage.minFundsDamage === damage.maxFundsDamage) {
            funds.textContent = `${damage.minFundsDamage}`
        } else {
            funds.innerHTML = `${damage.minFundsDamage}<span> - ${damage.maxFundsDamage}</span>`
        }
    }
}

export function updateCounterattackDisplay(
    calculator_window: Element,
    counterAtMin: CounterattackScenario | null,
    counterAtMax: CounterattackScenario | null,
): void {
    const min_span = calculator_window.querySelector(
        ".defender-damage .counter-min-display",
    ) as HTMLElement | null
    if (min_span) {
        if (counterAtMin) {
            min_span.innerHTML = `<span class="bold">@${counterAtMin.visualHp}HP</span> ${counterAtMin.minDamage}% - ${counterAtMin.maxDamage}%`
        } else {
            min_span.textContent = "N/A"
        }
    }

    const max_span = calculator_window.querySelector(
        ".defender-damage .counter-max-display",
    ) as HTMLElement | null
    if (max_span) {
        if (counterAtMax && counterAtMax.visualHp !== counterAtMin?.visualHp) {
            max_span.innerHTML = `<span class="bold">@${counterAtMax.visualHp}HP</span> ${counterAtMax.minDamage}% - ${counterAtMax.maxDamage}%`
            max_span.style.display = ""
        } else {
            max_span.style.display = "none"
        }
    }

    // Funds: show range across both counterattack scenarios
    const funds = calculator_window.querySelector(
        ".defender-damage .funds-damage-display",
    ) as HTMLElement | null
    if (funds) {
        const scenarios = [counterAtMin, counterAtMax].filter(
            (s): s is CounterattackScenario => s !== null,
        )
        if (scenarios.length === 0) {
            funds.textContent = "--"
        } else {
            const min_funds = Math.min(...scenarios.map((s) => s.minFundsDamage))
            const max_funds = Math.max(...scenarios.map((s) => s.maxFundsDamage))
            if (min_funds === max_funds) {
                funds.textContent = `${min_funds}`
            } else {
                funds.innerHTML = `${min_funds}<span> - ${max_funds}</span>`
            }
        }
    }
}
