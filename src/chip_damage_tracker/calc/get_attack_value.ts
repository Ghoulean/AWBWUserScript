import {
    AIR_UNITS,
    CO,
    COPowerType,
    DIRECT_UNITS,
    INDIRECT_UNITS,
    INFANTRY_UNITS,
    NAVAL_UNITS,
    Terrain,
    URBAN_TERRAIN,
    UnitType,
    VEHICLE_UNITS,
    getTerrainStars,
} from "../common/types"
import { CombatModifiers, CombatParticipant } from "./types"

export function getAttackValue(
    participant: CombatParticipant,
    combatModifiers: CombatModifiers,
): number {
    let attack = 100
    attack += participant.numComTowers * 10
    if (
        participant.cop == COPowerType.COP ||
        participant.cop == COPowerType.SCOP
    ) {
        attack += 10
    }

    if (participant.co == CO.Andy && participant.cop == COPowerType.SCOP) {
        attack += 10
    }
    if (participant.co == CO.Jake && participant.terrain == Terrain.Plains) {
        if (participant.cop == COPowerType.None) {
            attack += 10
        } else if (participant.cop == COPowerType.COP) {
            attack += 20
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 40
        }
    }
    if (participant.co == CO.Max && DIRECT_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            attack += 20
        } else if (participant.cop == COPowerType.COP) {
            attack += 30
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 50
        }
    }
    if (participant.co == CO.Max && INDIRECT_UNITS.has(participant.unit)) {
        attack -= 10
    }
    if (participant.co == CO.Sami && INFANTRY_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            attack += 30
        } else if (participant.cop == COPowerType.COP) {
            attack += 50
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 70
        }
    }
    if (participant.co == CO.Sami && DIRECT_UNITS.has(participant.unit)) {
        attack -= 10
    }
    if (participant.co == CO.Colin) {
        attack -= 10
        if (participant.cop == COPowerType.SCOP) {
            attack += (3 * participant.currentGold) / 1000
        }
    }
    if (participant.co == CO.Grit && DIRECT_UNITS.has(participant.unit)) {
        attack -= 20
    }
    if (participant.co == CO.Grit && INDIRECT_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            attack += 20
        } else if (
            participant.cop == COPowerType.COP ||
            participant.cop == COPowerType.SCOP
        ) {
            attack += 40
        }
    }
    if (participant.co == CO.Drake && AIR_UNITS.has(participant.unit)) {
        attack -= 20
    }
    if (participant.co == CO.Eagle && NAVAL_UNITS.has(participant.unit)) {
        attack -= 30
    }
    if (participant.co == CO.Eagle && AIR_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            attack += 15
        } else if (
            participant.cop == COPowerType.COP ||
            participant.cop == COPowerType.SCOP
        ) {
            attack += 20
        }
    }
    if (participant.co == CO.Jess && VEHICLE_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            attack += 10
        } else if (participant.cop == COPowerType.COP) {
            attack += 20
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 40
        }
    }
    if (participant.co == CO.Jess && !VEHICLE_UNITS.has(participant.unit)) {
        attack -= 10
    }
    if (participant.co == CO.Grimm) {
        if (participant.cop == COPowerType.None) {
            attack += 30
        } else if (participant.cop == COPowerType.COP) {
            attack += 50
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 80
        }
    }
    if (participant.co == CO.Kanbei) {
        if (participant.cop == COPowerType.None) {
            attack += 30
        } else if (participant.cop == COPowerType.COP) {
            attack += 40
        } else if (participant.cop == COPowerType.SCOP) {
            if (combatModifiers.isCounterattack) {
                attack += 95 // yes, not 90
            } else {
                attack += 40
            }
        }
    }
    if (participant.co == CO.Sensei && INFANTRY_UNITS.has(participant.unit)) {
        attack += 40
    }
    if (participant.co == CO.Sensei && participant.unit == UnitType.BCopter) {
        if (participant.cop == COPowerType.None) {
            attack += 50
        } else if (
            participant.cop == COPowerType.COP ||
            participant.cop == COPowerType.SCOP
        ) {
            attack += 65
        }
    }
    if (
        participant.co == CO.Sensei &&
        AIR_UNITS.has(participant.unit) &&
        participant.unit != UnitType.BCopter
    ) {
        attack -= 10
    }
    if (participant.co == CO.Sonja && combatModifiers.isCounterattack) {
        attack += 50
    }
    if (participant.co == CO.Hawke) {
        attack += 10
    }
    if (participant.co == CO.Kindle && URBAN_TERRAIN.has(participant.terrain)) {
        if (participant.cop == COPowerType.None) {
            attack += 40
        } else if (participant.cop == COPowerType.COP) {
            attack += 80
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 130
        }
    }
    if (participant.co == CO.Kindle && participant.cop == COPowerType.SCOP) {
        attack += 3 * participant.numCities
    }
    if (participant.co == CO.Koal && participant.terrain == Terrain.Road) {
        if (participant.cop == COPowerType.None) {
            attack += 10
        } else if (participant.cop == COPowerType.COP) {
            attack += 20
        } else if (participant.cop == COPowerType.SCOP) {
            attack += 30
        }
    }
    if (participant.co == CO.Lash) {
        let multiplier = participant.cop == COPowerType.SCOP ? 2 : 1
        attack += multiplier * getTerrainStars(participant.terrain) * 10
    }
    if (participant.co == CO.Sturm) {
        attack -= 20
    }
    if (participant.co == CO.VonBolt) {
        attack += 10
    }

    return attack
}
