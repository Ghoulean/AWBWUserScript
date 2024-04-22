import {
    AIR_UNITS,
    CO,
    COPowerType,
    NAVAL_UNITS,
} from "../../common/types"
import { CombatModifiers, CombatParticipant } from "../types"

export function getDefenseValue(
    participant: CombatParticipant,
    combatModifiers: CombatModifiers,
): number {
    let defense = 100
    if (
        participant.cop == COPowerType.COP ||
        participant.cop == COPowerType.SCOP
    ) {
        defense += 10
    }

    if (participant.co == CO.Drake && NAVAL_UNITS.has(participant.unit)) {
        defense += 25
    }
    if (participant.co == CO.Eagle && AIR_UNITS.has(participant.unit)) {
        if (participant.cop == COPowerType.None) {
            defense += 10
        } else if (
            participant.cop == COPowerType.COP ||
            participant.cop == COPowerType.SCOP
        ) {
            defense += 20
        }
    }
    if (
        participant.co == CO.Javier &&
        combatModifiers.isDefendingAgainstIndirect
    ) {
        if (participant.cop == COPowerType.None) {
            defense += 20
        } else if (participant.cop == COPowerType.COP) {
            defense += 40
        } else if (participant.cop == COPowerType.SCOP) {
            defense += 80
        }
    }
    if (participant.co == CO.Javier) {
        let comtowerBonus = participant.numCommTowers * 10
        if (participant.cop == COPowerType.None) {
            defense += comtowerBonus
        } else if (participant.cop == COPowerType.COP) {
            defense += comtowerBonus * 2
        } else if (participant.cop == COPowerType.SCOP) {
            defense += comtowerBonus * 3
        }
    }
    if (participant.co == CO.Grimm) {
        defense -= 20
    }
    if (participant.co == CO.Kanbei) {
        if (
            participant.cop == COPowerType.None ||
            participant.cop == COPowerType.COP
        ) {
            defense += 30
        } else if (participant.cop == COPowerType.SCOP) {
            defense += 50
        }
    }
    if (participant.co == CO.Sturm) {
        defense += 20
    }
    if (participant.co == CO.VonBolt) {
        defense += 10
    }

    return defense
}
