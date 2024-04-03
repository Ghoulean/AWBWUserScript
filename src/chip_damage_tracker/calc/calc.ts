function damage_calc(
    base: number,
    attack_value: number,
    luck: number,
    bad_luck: number,
    visual_hp_attacker: number,
    defense_value: number,
    defense_terrain: number,
    visual_hp_defender: number): number {
    const base_damage = ((base * attack_value / 100) + luck - bad_luck)
        * visual_hp_attacker / 10
        * (200 - (defense_value + defense_terrain * visual_hp_defender)) / 100;
    return Math.floor(Math.ceil(base_damage * 20) / 20);
}
