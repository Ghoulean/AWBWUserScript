import { ChipDamage, Damage, VisualDamageAndChip, ZERO_CHIP_DAMAGE } from "../types";

export function damageToVisualDamageAndChip(damage: Damage): VisualDamageAndChip {
    const min_visual_damage: number = Math.floor(damage[0] / 10)
    const damages: number[] = damage.map((x) => { return x - min_visual_damage });
    const chips: number[] = [];
    for (let i = 0; i <= damages[damages.length - 1]; i += 1) {
        chips.push(0);
    }
    for (let i = 0; i < damages.length; i += 1) {
        chips[damages[i]] += 1
    }
    return [min_visual_damage, chips]
}

// todo: implement the O(n log n) algo
export function addChipDamages(cd1: ChipDamage, cd2: ChipDamage): ChipDamage {
    const ret_val: ChipDamage = []
    for (let i = 0; i < cd1.length + cd2.length; i += 1) {
        ret_val.push(0);
    }
    for (let i = 0; i < cd1.length; i += 1) {
        for (let j = 0; j < cd2.length; j += 1) {
            ret_val[i + j] += cd1[i] * cd2[j]
        }
    }
    return ret_val;
}

export function simplifyChip(cd: ChipDamage): VisualDamageAndChip {
    let count_leading_zeroes: number = 0;
    for (; count_leading_zeroes < cd.length; count_leading_zeroes += 1) {
        if (cd[count_leading_zeroes] != 0) {
            count_leading_zeroes -= 1;
            break;
        }
    }
    if (count_leading_zeroes == cd.length) {
        return [0, ZERO_CHIP_DAMAGE]
    }
    const rounded = Math.floor(count_leading_zeroes / 10)
    return [rounded, cd.slice(rounded)]
}

export function addDamages(damage1: Damage, damage2: Damage): Damage[] {
    return [];
}