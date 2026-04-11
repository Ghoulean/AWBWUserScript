import {
    ChipDamage,
    Damage,
    VisualDamageAndChip,
    ZERO_CHIP_DAMAGE,
} from "../types"

export function damageToVisualDamageAndChip(
    damage: Damage,
): VisualDamageAndChip {
    const min_visual_damage: number = Math.floor(damage[0] / 10)
    const chips: number[] = []
    for (let i = 0; i <= damage[damage.length - 1] - min_visual_damage * 10; i += 1) {
        chips.push(0)
    }
    for (let i = 0; i < damage.length; i += 1) {
        chips[damage[i] - min_visual_damage * 10] += 1
    }
    return [min_visual_damage, chips]
}

// todo: investigate whether or not implementing the O(n log n) algo is worth
export function addChipDamages(cd1: ChipDamage, cd2: ChipDamage): ChipDamage {
    const ret_val: ChipDamage = []
    for (let i = 0; i < cd1.length + cd2.length; i += 1) {
        ret_val.push(0)
    }
    for (let i = 0; i < cd1.length; i += 1) {
        for (let j = 0; j < cd2.length; j += 1) {
            ret_val[i + j] += cd1[i] * cd2[j]
        }
    }
    return ret_val
}

export function simplifyChip(cd: ChipDamage): VisualDamageAndChip {
    let leading_zeros = 0
    for (; leading_zeros < cd.length; leading_zeros++) {
        if (cd[leading_zeros] != 0) break
    }
    if (leading_zeros == cd.length) {
        return [0, ZERO_CHIP_DAMAGE]
    }
    const rounded = Math.floor(leading_zeros / 10)
    return [rounded, cd.slice(rounded * 10)]
}

export function addDamages(
    damage1: VisualDamageAndChip,
    damage2: VisualDamageAndChip,
): VisualDamageAndChip {
    let added_chip = addChipDamages(damage1[1], damage2[1])
    let simplified_chip = simplifyChip(added_chip)
    return [damage1[0] + damage2[0] + simplified_chip[0], simplified_chip[1]]
}
