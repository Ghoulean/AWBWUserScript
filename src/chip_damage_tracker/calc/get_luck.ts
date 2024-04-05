import { CO, COPowerType } from "../common/types"
import { CombatParticipant, Luck } from "./types"

export function getMaxGoodLuck(participant: CombatParticipant): Luck {
    if (participant.co == CO.Nell) {
        if (participant.cop == COPowerType.None) {
            return 19
        } else if (participant.cop == COPowerType.COP) {
            return 59
        } else if (participant.cop == COPowerType.SCOP) {
            return 99
        }
    }
    if (participant.co == CO.Rachel && participant.cop == COPowerType.COP) {
        return 39
    }
    if (participant.co == CO.Flak) {
        if (participant.cop == COPowerType.None) {
            return 24
        } else if (participant.cop == COPowerType.COP) {
            return 49
        } else if (participant.cop == COPowerType.SCOP) {
            return 89
        }
    }
    if (participant.co == CO.Jugger) {
        if (participant.cop == COPowerType.None) {
            return 29
        } else if (participant.cop == COPowerType.COP) {
            return 54
        } else if (participant.cop == COPowerType.SCOP) {
            return 94
        }
    }

    return 9
}

export function getMaxBadLuck(participant: CombatParticipant): Luck {
    if (participant.co == CO.Sonja) {
        return 9
    }
    if (participant.co == CO.Flak) {
        if (participant.cop == COPowerType.None) {
            return 9
        } else if (participant.cop == COPowerType.COP) {
            return 19
        } else if (participant.cop == COPowerType.SCOP) {
            return 39
        }
    }
    if (participant.co == CO.Jugger) {
        if (participant.cop == COPowerType.None) {
            return 14
        } else if (participant.cop == COPowerType.COP) {
            return 24
        } else if (participant.cop == COPowerType.SCOP) {
            return 44
        }
    }

    return 0
}
