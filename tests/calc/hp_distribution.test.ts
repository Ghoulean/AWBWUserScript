import { parseUnitName } from "src/common/awbw_utils"
import { UnitType } from "src/common/types"
import {
    applyDamage,
    conditionOnVisualHp,
    hpRange,
    pointMass,
    shiftHp,
    uniformForVisualHp,
} from "src/calc/hp_distribution"

test("conditioning keeps only true HP matching the visual HP", () => {
    const dist = applyDamage(pointMass(100), [44, 45, 46, 47, 48, 49, 50, 51])

    const conditioned = conditionOnVisualHp(dist, 6)

    expect(hpRange(conditioned!)).toEqual([51, 56])
    expect(conditioned![56]).toBeCloseTo(1 / 6)
})

test("impossible observations condition to null", () => {
    expect(conditionOnVisualHp(pointMass(55), 7)).toBeNull()
})

test("power damage cannot kill", () => {
    const shifted = shiftHp(uniformForVisualHp(3), -30)

    expect(shifted[1]).toBeCloseTo(1)
})

test("heals cap at 100", () => {
    const shifted = shiftHp(uniformForVisualHp(9), 20)

    expect(shifted[100]).toBeCloseTo(1)
})

test("parses AWBW unit names", () => {
    expect(parseUnitName("Md.Tank")).toBe(UnitType.MdTank)
    expect(parseUnitName("Anti-Air")).toBe(UnitType.Antiair)
    expect(parseUnitName("B-Copter")).toBe(UnitType.BCopter)
    expect(parseUnitName("Sub")).toBe(UnitType.Submarine)
    expect(parseUnitName("Black Bomb")).toBe(UnitType.BlackBomb)
})
