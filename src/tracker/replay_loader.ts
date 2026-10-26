import {
    ReplayAction,
    ReplayPlayer,
    ReplayTurn,
    ReplayUnit,
} from "./replay_types"

const REQUEST_INTERVAL_MS = 500
const RATE_LIMIT_BACKOFF_MS = 5000
const MAX_ATTEMPTS = 5
const CACHE_PREFIX = "awbw-true-hp-replay"
const IGNORED_ACTIONS = new Set([
    "Move",
    "Capt",
    "NextTurn",
    "Load",
    "Unload",
    "Supply",
    "Hide",
    "Unhide",
])

interface RawReplayTurn {
    err?: boolean
    day: number
    actions: ReplayAction[]
    gameState: {
        units: Record<string, ReplayUnit> | null
        players: Record<string, ReplayPlayer> | null
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function cacheKey(gameId: number, turn: number): string {
    return `${CACHE_PREFIX}:${gameId}:${turn}`
}

function readCache(gameId: number, turn: number): ReplayTurn | null {
    try {
        const value = localStorage.getItem(cacheKey(gameId, turn))
        return value ? (JSON.parse(value) as ReplayTurn) : null
    } catch {
        return null
    }
}

function writeCache(gameId: number, turn: number, value: ReplayTurn): void {
    try {
        localStorage.setItem(cacheKey(gameId, turn), JSON.stringify(value))
    } catch {
        // cache is optional
    }
}

function compactTurn(raw: RawReplayTurn): ReplayTurn {
    return {
        day: raw.day,
        units: Object.values(raw.gameState.units ?? {}).map((unit) => ({
            units_id: unit.units_id,
            units_players_id: unit.units_players_id,
            generic_id: unit.generic_id,
            units_name: unit.units_name,
            units_hit_points: unit.units_hit_points,
            units_ammo: unit.units_ammo,
            units_x: unit.units_x,
            units_y: unit.units_y,
        })),
        players: Object.values(raw.gameState.players ?? {}).map((player) => ({
            players_id: player.players_id,
            players_co_id: player.players_co_id,
            players_co_power_on: player.players_co_power_on,
            players_funds: player.players_funds,
            cities: player.cities,
            towers: player.towers,
        })),
        actions: raw.actions.filter(
            (action) => !IGNORED_ACTIONS.has(action.action),
        ),
    }
}

async function fetchTurn(
    gameId: number,
    turn: number,
): Promise<RawReplayTurn | null> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const response = await fetch("/api/game/load_replay.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId, turn }),
            credentials: "include",
        })
        if (response.status === 429) {
            await sleep(RATE_LIMIT_BACKOFF_MS * attempt)
            continue
        }
        const json = (await response.json()) as RawReplayTurn
        return json.err || !json.gameState ? null : json
    }
    throw new Error(`load_replay rate limited at turn ${turn}`)
}

export async function loadReplayTurns(
    gameId: number,
    onProgress: (day: number) => void,
): Promise<ReplayTurn[]> {
    const turns: ReplayTurn[] = []
    for (let turn = 0; ; turn++) {
        const cached = readCache(gameId, turn)
        if (cached) {
            turns.push(cached)
            continue
        }
        const raw = await fetchTurn(gameId, turn)
        if (!raw) {
            break
        }
        if (turn > 0 && !readCache(gameId, turn - 1)) {
            writeCache(gameId, turn - 1, turns[turn - 1])
        }
        turns.push(compactTurn(raw))
        onProgress(turns[turns.length - 1].day)
        await sleep(REQUEST_INTERVAL_MS)
    }
    return turns
}
