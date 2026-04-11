# AWBW True HP Tools

True HP tracker and calculator for the browser game Advance Wars By Web ("AWBW")

## Background: AWBW Combat Mechanics

AWBW is a turned-based strategy browser game.

A Commanding Officer ("CO") is a playable character in AWBW and represents the leader of an army. Every CO has an ability that is always active ("day to day" or "DTD" ability) and two activatable abilities, termed "CO Power" ("COP") and "Super CO Power" ("Super COP" or "SCOP"). More on these abilities later.

Units do not have bespoke values for "health", "attack", and "defense", but instead uses a system of base damage alongside a series of modifiers to determine damage dealt.

All units have the same number of base hit points: 100. However, in-game, units visually have a health range from 1 to 10, and their visual hit points is equal to their actual hit points divided by 10, rounded up. For example, units at 1 actual hit point are visually at 1 hit point, and units at 49 hit points are visually at 5 hit points. For clarity, the terms "visual hp" and "hp" henceforth refers to units' visual hit points and the term "true hp" refers to units' actual hit points.

Units' base attack and defense are also 100 and 100, respectively. Bonuses are visually represented as percentages, but increase and decrease a units' stats additively. Attack and defense are commonly represented in the form `<attack>/<defense>`. For example, Max, a CO, has a DTD that grants all direct-fire units +20% attack but grants all indirect-fire units -10% attack. His direct fire units' stats are 120/100 and his indirect-fire units' stats are 90/100. Units may gain stats from the terrain they're standing on, CO DTDs, COPs, and SCOPs. 

A defense star (also known as terrain star) is the defensive rating of a terrain type. Each defense star grants +10% defense to full hp occupying units, but this defense bonus scales off unit health (see damage formula below). Air units cannot receive defense star bonuses.

Units last stat is their base damage. This is a hardcoded, matchup-specific damage number that a full-health unit will do to another full-health unit assuming both defender and attacker stats are 100/100 and without any luck modifiers. The minimum base damage is 1; if a unit's base damage against another is 0, that means it cannot attack or is ineligible to attack that unit.

When two units initiate combat with each other, the defender may retaliate in the same turn. The counterattack damage uses the same damage formula but with the attacker and defender swapped, and with the original defender attacking with reduced HP. Counterattacks only occur if all three of the following conditions hold:

1. The primary attack was a direct attack (indirect attacks performed by indirect combat units cannot be counterattacked)
2. The attacked unit survives (dead units do not fire back)
3. The attacked unit can attack the other unit (e.g. Infantry cannot attack Bombers, so a Bomber attacking an Infantry will not be counterattacked, even if the Infantry survives).

**Damage Formula**: Damage = (B * A) / 100 + L * (HP_A / 10) * ((200 - D_v + D_tr * HP_D) / 100)

Where:

- Damage - numerical amount which the defender's true hp decreases by
- B - Base damage against that unit
- A - Attacker attack value (e.g. 120 for Max's direct fire units)
- L - Luck modifier, defaults to a uniformly random integer between 0 and 9 (inclusive), but some COs have different luck spreads
- HP_A - Visual HP of attacker
- D_v - Defender defense value
- D_tr - Defender's terrain's defense star value
- HP_D - Visual HP of defender

If the damage formula somehow returns a negative number, the unit deals 0 damage instead.

Finally, two rounding steps occur at the end of damage calculation:
1. The calculated damage value is rounded up to the nearest interval of 0.05
2. The calculated damage value is rounded down to the nearest integer

## Project Goal

Tracking true hp of units is difficult and obscured, especially due to the luck mechanic, yet this obscured mechanic can turn the tide in close combats. This project has two goals:

1. Track the current true hp of units represented as a probability distribution
2. Implement true hp tracking in AWBW combat calculators, which current tooling lacks
