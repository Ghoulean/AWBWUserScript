export const MAX_TRUE_HP = 100

// index = true hp (0 to 100), value = probability
export type HpDistribution = number[]

export function emptyDistribution(): HpDistribution {
    return new Array(MAX_TRUE_HP + 1).fill(0)
}

export function pointMass(trueHp: number): HpDistribution {
    const dist = emptyDistribution()
    dist[trueHp] = 1
    return dist
}

export function visualHpOf(trueHp: number): number {
    return Math.ceil(trueHp / 10)
}

export function uniformForVisualHp(visualHp: number): HpDistribution {
    if (visualHp <= 0) {
        return pointMass(0)
    }
    const dist = emptyDistribution()
    for (let hp = visualHp * 10 - 9; hp <= visualHp * 10; hp++) {
        dist[hp] = 1 / 10
    }
    return dist
}

export function applyDamage(
    dist: HpDistribution,
    damages: number[],
): HpDistribution {
    const result = emptyDistribution()
    for (let hp = 0; hp <= MAX_TRUE_HP; hp++) {
        if (dist[hp] === 0) continue
        for (const damage of damages) {
            result[Math.max(0, hp - damage)] += dist[hp] / damages.length
        }
    }
    return result
}

// damage from CO powers and silos can't kill units
// floor at 1 hp
export function shiftHp(dist: HpDistribution, delta: number): HpDistribution {
    const result = emptyDistribution()
    for (let hp = 1; hp <= MAX_TRUE_HP; hp++) {
        if (dist[hp] === 0) continue
        result[Math.min(MAX_TRUE_HP, Math.max(1, hp + delta))] += dist[hp]
    }
    result[0] += dist[0]
    return result
}

export function likelihoodOfVisualHp(
    dist: HpDistribution,
    visualHp: number,
): number {
    let total = 0
    for (let hp = 0; hp <= MAX_TRUE_HP; hp++) {
        if (visualHpOf(hp) === visualHp) {
            total += dist[hp]
        }
    }
    return total
}

export function conditionOnVisualHp(
    dist: HpDistribution,
    visualHp: number,
): HpDistribution | null {
    const total = likelihoodOfVisualHp(dist, visualHp)
    if (total < 1e-12) {
        return null
    }
    return dist.map((p, hp) => (visualHpOf(hp) === visualHp ? p / total : 0))
}

export function hpRange(dist: HpDistribution): [number, number] {
    let min = MAX_TRUE_HP
    let max = 0
    for (let hp = 0; hp <= MAX_TRUE_HP; hp++) {
        if (dist[hp] > 0) {
            min = Math.min(min, hp)
            max = Math.max(max, hp)
        }
    }
    return [min, max]
}

export function mostLikelyHp(dist: HpDistribution): number {
    let best = 0
    for (let hp = 1; hp <= MAX_TRUE_HP; hp++) {
        if (dist[hp] > dist[best]) {
            best = hp
        }
    }
    return best
}

export function mixDistributions(
    parts: [number, HpDistribution][],
): HpDistribution {
    const result = emptyDistribution()
    for (const [weight, dist] of parts) {
        for (let hp = 0; hp <= MAX_TRUE_HP; hp++) {
            result[hp] += weight * dist[hp]
        }
    }
    return result
}
