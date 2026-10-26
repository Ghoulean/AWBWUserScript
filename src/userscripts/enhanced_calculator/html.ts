import { HpDistribution, hpRange } from "src/calc/hp_distribution"
import { AWBWCalculatorSideName } from "src/common/awbw_types"
import { ElementTag, Attribute } from "src/common/html_types"
import { CombatResult, TrueHpRange } from "./model"

export type TrueHpSource = "tracked" | "set" | "assumed"

export interface SideView {
    inputValue: number
    distribution: HpDistribution
    source: TrueHpSource
}

const TRUE_HP_PANEL_CSS = `
.true-hp-panel {
    border-top: 1px solid #888888;
    font-size: 11px;
    padding: 4px 0;
}
.true-hp-sides {
    display: flex;
}
.true-hp-side {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}
.true-hp-side input {
    text-align: center;
    width: 48px;
}
.true-hp-label {
    font-weight: bold;
}
.true-hp-histogram {
    align-items: flex-end;
    display: flex;
    gap: 1px;
    height: 16px;
}
.true-hp-histogram span {
    background: #4a7bd0;
    min-height: 1px;
    width: 5px;
}
.true-hp-histogram span.empty {
    background: #cccccc;
}
.true-hp-status {
    color: #666666;
    padding-top: 2px;
    text-align: left;
}
`

export function injectTrueHpPanelStyles(doc: Document): void {
    const style = doc.createElement("style")
    style.textContent = TRUE_HP_PANEL_CSS
    doc.head.appendChild(style)
}

export function buildTrueHpPanel(doc: Document): Element {
    const panel = doc.createElement(ElementTag.DIV)
    panel.setAttribute(Attribute.CLASS, "true-hp-panel")
    const sides = doc.createElement(ElementTag.DIV)
    sides.setAttribute(Attribute.CLASS, "true-hp-sides")
    sides.append(buildSide(doc, "attacker"), buildSide(doc, "defender"))
    const status = doc.createElement(ElementTag.DIV)
    status.setAttribute(Attribute.CLASS, "true-hp-status")
    panel.append(sides, status)
    return panel
}

function buildSide(doc: Document, side: AWBWCalculatorSideName): Element {
    const container = doc.createElement(ElementTag.DIV)
    container.setAttribute(Attribute.CLASS, `true-hp-side true-hp-${side}`)
    container.innerHTML = `
        <span><span class="true-hp-label">True HP</span> <input type="number" min="1" max="100" /></span>
        <div class="true-hp-histogram"></div>
        <span class="true-hp-range">--</span>
        <span><span class="true-hp-label">After</span> <span class="true-hp-after">--</span></span>
        <span><span class="true-hp-label">Death</span> <span class="true-hp-death">--</span></span>
    `
    return container
}

export function getTrueHpInput(
    panel: Element,
    side: AWBWCalculatorSideName,
): HTMLInputElement {
    return panel.querySelector(`.true-hp-${side} input`) as HTMLInputElement
}

export function renderTrueHp(
    panel: Element,
    attacker: SideView,
    defender: SideView,
    result: CombatResult | null,
    status: string,
): void {
    renderSide(panel, "attacker", attacker)
    renderSide(panel, "defender", defender)
    setText(
        panel,
        ".true-hp-attacker .true-hp-after",
        result ? formatRange(result.attackerHpAfter) : "--",
    )
    setText(
        panel,
        ".true-hp-defender .true-hp-after",
        result ? formatRange(result.defenderHpAfter) : "--",
    )
    setText(
        panel,
        ".true-hp-attacker .true-hp-death",
        result ? formatPercent(result.attackerDeathChance) : "--",
    )
    setText(
        panel,
        ".true-hp-defender .true-hp-death",
        result ? formatPercent(result.defenderDeathChance) : "--",
    )
    setText(panel, ".true-hp-status", status)
}

function renderSide(
    panel: Element,
    side: AWBWCalculatorSideName,
    view: SideView,
): void {
    const input = getTrueHpInput(panel, side)
    if (input.ownerDocument.activeElement !== input) {
        input.value = `${view.inputValue}`
    }
    setText(
        panel,
        `.true-hp-${side} .true-hp-range`,
        `${formatRange(hpRange(view.distribution))} (${view.source})`,
    )

    const histogram = panel.querySelector(`.true-hp-${side} .true-hp-histogram`)
    if (!histogram) return
    const top = Math.ceil(view.inputValue / 10) * 10
    const bucket = view.distribution.slice(Math.max(0, top - 9), top + 1)
    const max = Math.max(...bucket)
    histogram.innerHTML = bucket
        .map((p, i) => {
            const hp = top - 9 + i
            const height = max > 0 ? Math.round((p / max) * 16) : 0
            const cls = p > 0 ? "" : ` class="empty"`
            return `<span${cls} style="height: ${height}px" title="${hp}: ${formatPercent(p)}"></span>`
        })
        .join("")
}

function setText(panel: Element, selector: string, text: string): void {
    const element = panel.querySelector(selector)
    if (element) {
        element.textContent = text
    }
}

function formatRange(range: TrueHpRange): string {
    return range[0] === range[1] ? `${range[0]}` : `${range[0]} - ${range[1]}`
}

function formatPercent(p: number): string {
    return `${Math.round(p * 100)}%`
}
