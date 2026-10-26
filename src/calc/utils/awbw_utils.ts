import { AWBWCalculatorSide, AWBWUnit } from "src/common/awbw_types"
import { CombatParticipant } from "../types"
import { PlayersInfo, PlayerInfo, Terrain } from "src/common/types"
import { convertTileIdToTerrain, parseCOPowerOn } from "src/common/awbw_utils"

export function parseAWBWUnit(
    playersInfo: PlayersInfo,
    terrain: Terrain,
    unit: AWBWUnit,
): CombatParticipant {
    const player_info: PlayerInfo = playersInfo[unit.units_player_id]
    return {
        co: player_info.co,
        cop: player_info.cop,
        unit: unit.generic_id,
        visualHp: unit.units_hit_points,
        terrain: terrain,
        numCommTowers: player_info.numCommTowers,
        numCities: player_info.numCities,
        currentGold: player_info.funds,
    }
}

export function parseAWBWCalculatorSide(
    side: AWBWCalculatorSide,
): CombatParticipant {
    return {
        co: side.co.co_id,
        cop: parseCOPowerOn(side.power),
        unit: side.unit.units_id,
        visualHp: Number(side.hp),
        terrain: convertTileIdToTerrain(side.terrain.terrain_id),
        numCommTowers: Number(side.towers),
        numCities: Number(side.cities),
        currentGold: Number(side.funds),
        ammoless: !side.hasAmmo,
    }
}
