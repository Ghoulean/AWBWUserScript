import { BoardLocationKey, UnitId, BoardLocation } from "src/common/types"

export type PointInTime = number
export type ChipDamage = [number, number]
export type LocationToUnitIdMap = Map<BoardLocationKey, UnitId>
export type UnitIdToChipDamageMap = Map<UnitId, ChipDamage>
export function calcBoardLocationKey(loc: BoardLocation): BoardLocationKey {
    return `${loc[0]},${loc[1]}`
}

function main() {
    console.log("hi!")
}

window.addEventListener("load", main)
