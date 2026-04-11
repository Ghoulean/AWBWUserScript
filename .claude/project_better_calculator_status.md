---
name: better_calculator current status
description: What has been implemented in the better_calculator userscript and what remains
type: project
---

As of 2026-04-10, the better_calculator userscript has:

**Done:**
- Full damage formula + all CO attack/defense/luck bonuses (tests pass)
- Fixed two bugs in chip arithmetic: `damageToVisualDamageAndChip` subtracted visual units from true HP units; `simplifyChip` had an off-by-one in the leading-zero count and sliced `cd.slice(rounded)` instead of `cd.slice(rounded * 10)`
- `computeCombatResult`: real counterattack eligibility (direct attack, can-retaliate check via base damage map, survival check), both counterattack scenarios (at min and max primary damage), funds damage via `getUnitCost`
- Calculator window injected into DOM at load; CSS injected as `<style>` tag; toggle/close/drag all work
- `window.calculateDamage` overridden so AWBW's calculator triggers our display update (valid with `@grant none`)

**Not done / next steps:**
- Unit selection via 'A'/'D' + map click: blocked on AWBW's map DOM structure -- need to know how clicks on unit tiles fire and which global exposes unit-by-position lookup
- Swap button is a no-op: no local attacker/defender state tracked yet (depends on unit selection)
- Chip tracking across turns: project goal 1, `chip_damage_tracker` userscript is a stub
- `Teleporter` and `Pipeseam` terrain types are missing from `getTerrainStars` in `src/common/utils.ts` and would throw at runtime if a unit stands on either tile
