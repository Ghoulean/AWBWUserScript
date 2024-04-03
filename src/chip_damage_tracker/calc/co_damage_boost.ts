import { AIR_UNITS, CO, COPowerType, DIRECT_UNITS, INDIRECT_UNITS, INFANTRY_UNITS, NAVAL_UNITS, Terrain, URBAN_TERRAIN, UnitType, VEHICLE_UNITS, getTerrainStars } from "../common/types";

export interface CombatModifiers {
    co: CO,
    unit: UnitType,
    cop: COPowerType,
    terrain: Terrain,
    numComTowers: number,
    numCities: number,
    currentGold: number,
    isCounterattack: boolean,
}

function getAttackValue(cm: CombatModifiers): number {
    let attack = 100;
    if (cm.cop != COPowerType.None) {
        attack += 10;
    }
    if (cm.co == CO.Andy && cm.cop == COPowerType.SCOP) {
        attack += 10;
    }
    if (cm.co == CO.Jake && cm.terrain == Terrain.Plains) {
        if (cm.cop == COPowerType.None) {
            attack += 10;
        } else if (cm.cop == COPowerType.COP) {
            attack += 20;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 40;
        }
    }
    if (cm.co == CO.Max && DIRECT_UNITS.has(cm.unit)) {
        if (cm.cop == COPowerType.None) {
            attack += 20;
        } else if (cm.cop == COPowerType.COP) {
            attack += 30;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 50;
        }
    }
    if (cm.co == CO.Max && INDIRECT_UNITS.has(cm.unit)) {
        attack -= 10;
    }
    if (cm.co == CO.Sami && INFANTRY_UNITS.has(cm.unit)) {
        if (cm.cop == COPowerType.None) {
            attack += 30;
        } else if (cm.cop == COPowerType.COP) {
            attack += 50;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 70;
        }
    }
    if (cm.co == CO.Colin) {
        attack -= 10;
        if (cm.cop == COPowerType.SCOP) {
            attack += 3 * cm.currentGold / 1000
        }
    }
    if (cm.co == CO.Grit && DIRECT_UNITS.has(cm.unit)) {
        attack -= 20;
    }
    if (cm.co == CO.Grit && INDIRECT_UNITS.has(cm.unit)) {
        if (cm.cop == COPowerType.None) {
            attack += 20;
        } else if (cm.cop == COPowerType.COP || cm.cop == COPowerType.SCOP) {
            attack += 40;
        }
    }
    if (cm.co == CO.Drake && AIR_UNITS.has(cm.unit)) {
        attack -= 20;
    }
    if (cm.co == CO.Eagle && NAVAL_UNITS.has(cm.unit)) {
        attack -= 30;
    }
    if (cm.co == CO.Eagle && AIR_UNITS.has(cm.unit)) {
        if (cm.cop == COPowerType.None) {
            attack += 15;
        } else if (cm.cop == COPowerType.COP || cm.cop == COPowerType.SCOP) {
            attack += 20;
        }
    }
    if (cm.co == CO.Jess && VEHICLE_UNITS.has(cm.unit)) {
        if (cm.cop == COPowerType.None) {
            attack += 10;
        } else if (cm.cop == COPowerType.COP) {
            attack += 20;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 40;
        }
    }
    if (cm.co == CO.Jess && !VEHICLE_UNITS.has(cm.unit)) {
        attack -= 10
    }
    if (cm.co == CO.Grimm) {
        if (cm.cop == COPowerType.None) {
            attack += 30;
        } else if (cm.cop == COPowerType.COP) {
            attack += 50;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 80;
        }
    }
    if (cm.co == CO.Kanbei) {
        if (cm.cop == COPowerType.None) {
            attack += 30;
        } else if (cm.cop == COPowerType.COP) {
            attack += 40;
        } else if (cm.cop == COPowerType.SCOP) {
            if (cm.isCounterattack) {
                attack += 95; // yes, not 90
            } else {
                attack += 40;
            }
        }
    }
    if (cm.co == CO.Sensei && INFANTRY_UNITS.has(cm.unit)) {
        attack += 40
    }
    if (cm.co == CO.Sensei && cm.unit == UnitType.BCopter) {
        if (cm.cop == COPowerType.None) {
            attack += 50;
        } else if (cm.cop == COPowerType.COP || cm.cop == COPowerType.SCOP) {
            attack += 65;
        }
    }
    if (cm.co == CO.Sensei && AIR_UNITS.has(cm.unit) && cm.unit != UnitType.BCopter) {
        attack -= 10
    }
    if (cm.co == CO.Sonja && cm.isCounterattack) {
        attack += 50
    }
    if (cm.co == CO.Hawke) {
        attack += 10
    }
    if (cm.co == CO.Kindle && URBAN_TERRAIN.has(cm.terrain)) {
        if (cm.cop == COPowerType.None) {
            attack += 40;
        } else if (cm.cop == COPowerType.COP) {
            attack += 80;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 130;
        }
    }
    if (cm.co == CO.Kindle && cm.cop == COPowerType.SCOP) {
        attack += 3 * cm.numCities
    }
    if (cm.co == CO.Koal && cm.terrain == Terrain.Road) {
        if (cm.cop == COPowerType.None) {
            attack += 10;
        } else if (cm.cop == COPowerType.COP) {
            attack += 20;
        } else if (cm.cop == COPowerType.SCOP) {
            attack += 30;
        }
    }
    if (cm.co == CO.Lash) {
        let multiplier = (cm.cop == COPowerType.SCOP ? 2 : 1);
        attack += multiplier * getTerrainStars(cm.terrain)
    }
    if (cm.co == CO.Sturm) {
        attack -= 20
    }
    if (cm.co == CO.VonBolt) {
        attack += 10
    }

    return attack
}