import { ElementTag, Attribute } from "src/common/html_types";
import calculator_png from "./assets/calculator.png";

export function buildCalculatorToggleButtonHtml(doc: Document): Element {
    const buttonDiv = doc.createElement(ElementTag.DIV)
    buttonDiv.setAttribute(Attribute.CLASS, "game-tools-btn");

    const imageDiv = doc.createElement(ElementTag.DIV)
    imageDiv.setAttribute(Attribute.CLASS, "game-tools-bg");
    
    const image = doc.createElement(ElementTag.IMG)
    image.setAttribute(Attribute.IMG_SRC, calculator_png);
    image.setAttribute(Attribute.STYLE, "display: block;");

    const tooltip = doc.createElement(ElementTag.DIV)
    tooltip.setAttribute(Attribute.CLASS, "game-tools-btn-text small_text")
    tooltip.innerHTML = "Better Calculator"

    buttonDiv.append(imageDiv, tooltip)
    imageDiv.append(image)

    return buttonDiv;
}

/*

<div class="game-tools-btn" style="border-right: none;">
    <div class="game-tools-bg">
    <img src="calculator.png" style="display: block;">
    </div>
    <span class="game-tools-btn-text small_text">Better Calculator</span>
</div>

*/