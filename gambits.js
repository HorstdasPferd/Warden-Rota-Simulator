/**
 * Warden Gambit Database
 * Sequences: 1=Spear, 2=Shield, 3=Fist
 */

const GAMBIT_DB = {
  // 2-Builder Gambits
  "11": {
    name: "Deft Strike",
    description: "Damage + Potency",
    sequence: [1, 1],
    icon: "img/icons/Deft_Strike.png",
    tooltip: "img/tooltips/Deft_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Deft_Strike"
  },
  "22": {
    name: "Defensive Strike",
    description: "Damage + Potency",
    sequence: [2, 2],
    icon: "img/icons/Defensive_Strike.png",
    tooltip: "img/tooltips/Defensive_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Defensive_Strike"
  },
  "33": {
    name: "Goad",
    description: "AoE Damage + Potency",
    sequence: [3, 3],
    icon: "img/icons/Goad.png",
    tooltip: "img/tooltips/Goad.png",
    wiki: "https://lotro-wiki.com/wiki/Goad"
  },
  "13": {
    name: "Offensive Strike",
    description: "AoE Damage",
    sequence: [1, 3],
    icon: "img/icons/Offensive_Strike.png",
    tooltip: "img/tooltips/Offensive_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Offensive_Strike"
  },
  "12": {
    name: "The Boot",
    description: "Damage + Interrupt",
    sequence: [1, 2],
    icon: "img/icons/The_Boot.png",
    tooltip: "img/tooltips/The_Boot.png",
    wiki: "https://lotro-wiki.com/wiki/The_Boot"
  },
  "21": {
    name: "Persevere",
    description: "Damage + Heal + HoT + Buff",
    sequence: [2, 1],
    icon: "img/icons/Persevere.png",
    tooltip: "img/tooltips/Persevere.png",
    wiki: "https://lotro-wiki.com/wiki/Persevere"
  },
  "23": {
    name: "Impressive Flourish",
    description: "Damage + Buff",
    sequence: [2, 3],
    icon: "img/icons/Impressive_Flourish.png",
    tooltip: "img/tooltips/Impressive_Flourish.png",
    wiki: "https://lotro-wiki.com/wiki/Impressive_Flourish"
  },
  "31": {
    name: "Precise Blow",
    description: "Damage + DoT",
    sequence: [3, 1],
    icon: "img/icons/Precise_Blow.png",
    tooltip: "img/tooltips/Precise_Blow.png",
    wiki: "https://lotro-wiki.com/wiki/Precise_Blow"
  },
  "32": {
    name: "War-cry",
    description: "AoE Damage + DoT",
    sequence: [3, 2],
    icon: "img/icons/War-Cry.png",
    tooltip: "img/tooltips/War-Cry.png",
    wiki: "https://lotro-wiki.com/wiki/War-cry"
  },

  // 3-Builder Gambits
  "123": {
    name: "Power Attack",
    description: "Damage + DoT",
    sequence: [1, 2, 3],
    icon: "img/icons/Power_Attack.png",
    tooltip: "img/tooltips/Power_Attack.png",
    wiki: "https://lotro-wiki.com/wiki/Power_Attack"
  },
  "131": {
    name: "Combination Strike",
    description: "AoE Damage",
    sequence: [1, 3, 1],
    icon: "img/icons/Combination_Strike.png",
    tooltip: "img/tooltips/Combination_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Combination_Strike"
  },
  "212": {
    name: "Safeguard",
    description: "Damage + Heal + HoT",
    sequence: [2, 1, 2],
    icon: "img/icons/Safeguard.png",
    tooltip: "img/tooltips/Safeguard.png",
    wiki: "https://lotro-wiki.com/wiki/Safeguard"
  },
  "232": {
    name: "Maddening Strike",
    description: "Damage + Buff",
    sequence: [2, 3, 2],
    icon: "img/icons/Maddening_Strike.png",
    tooltip: "img/tooltips/Maddening_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Maddening_Strike"
  },
  "313": {
    name: "Piercing Strike",
    description: "Damage + DoT",
    sequence: [3, 1, 3],
    icon: "img/icons/Piercing_Strike.png",
    tooltip: "img/tooltips/Piercing_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Piercing_Strike"
  },
  "323": {
    name: "Brink of Victory",
    description: "AoE Damage + DoT",
    sequence: [3, 2, 3],
    icon: "img/icons/Brink_of_Victory.png",
    tooltip: "img/tooltips/Brink_of_Victory.png",
    wiki: "https://lotro-wiki.com/wiki/Brink_of_Victory"
  },
  "213": {
    name: "Shield Up",
    description: "Buff",
    sequence: [2, 1, 3],
    icon: "img/icons/Shield_Up.png",
    tooltip: "img/tooltips/Shield_Up.png",
    wiki: "https://lotro-wiki.com/wiki/Shield_Up"
  },
  "231": {
    name: "Readied Blade",
    description: "Buff",
    sequence: [2, 3, 1],
    icon: "img/icons/Readied_Blade.png",
    tooltip: "img/tooltips/Readied_Blade.png",
    wiki: "https://lotro-wiki.com/wiki/Readied_Blade"
  },
  "132": {
    name: "Reversal",
    description: "Damage + Corruption",
    sequence: [1, 3, 2],
    icon: "img/icons/Reversal.png",
    tooltip: "img/tooltips/Reversal.png",
    wiki: "https://lotro-wiki.com/wiki/Reversal"
  },
  "312": {
    name: "Fierce Resolve",
    description: "AoE Morale-tap",
    sequence: [3, 1, 2],
    icon: "img/icons/Fierce_Resolve.png",
    tooltip: "img/tooltips/Fierce_Resolve.png",
    wiki: "https://lotro-wiki.com/wiki/Fierce_Resolve"
  },
  "121": {
    name: "Onslaught",
    description: "Damage",
    sequence: [1, 2, 1],
    icon: "img/icons/Onslaught.png",
    tooltip: "img/tooltips/Onslaught.png",
    wiki: "https://lotro-wiki.com/wiki/Onslaught"
  },
  "321": {
    name: "Deflection",
    description: "AoE Threat Reduction",
    sequence: [3, 2, 1],
    icon: "img/icons/Deflection.png",
    tooltip: "img/tooltips/Deflection.png",
    wiki: "https://lotro-wiki.com/wiki/Deflection"
  },

  // 4-Builder Gambits
  "1231": {
    name: "Mighty Blow",
    description: "Damage + DoT",
    sequence: [1, 2, 3, 1],
    icon: "img/icons/Mighty_Blow.png",
    tooltip: "img/tooltips/Mighty_Blow.png",
    wiki: "https://lotro-wiki.com/wiki/Mighty_Blow"
  },
  "1313": {
    name: "Boar's Rush",
    description: "AoE Damage",
    sequence: [1, 3, 1, 3],
    icon: "img/icons/Boars_Rush.png",
    tooltip: "img/tooltips/Boars_Rush.png",
    wiki: "https://lotro-wiki.com/wiki/Boars_Rush"
  },
  "3131": {
    name: "Spear of Virtue",
    description: "Damage + DoT",
    sequence: [3, 1, 3, 1],
    icon: "img/icons/Spear_of_Virtue.png",
    tooltip: "img/tooltips/Spear_of_Virtue.png",
    wiki: "https://lotro-wiki.com/wiki/Spear_of_Virtue"
  },
  "3231": {
    name: "Resounding Challenge",
    description: "AoE Damage + DoT",
    sequence: [3, 2, 3, 1],
    icon: "img/icons/Resounding_Challenge.png",
    tooltip: "img/tooltips/Resounding_Challenge.png",
    wiki: "https://lotro-wiki.com/wiki/Resounding_Challenge"
  },
  "2132": {
    name: "Shield Mastery",
    description: "Buff",
    sequence: [2, 1, 3, 2],
    icon: "img/icons/Shield_Mastery.png",
    tooltip: "img/tooltips/Shield_Mastery.png",
    wiki: "https://lotro-wiki.com/wiki/Shield_Mastery"
  },
  "2312": {
    name: "Shield Tactics",
    description: "Buff + Stun Immunity",
    sequence: [2, 3, 1, 2],
    icon: "img/icons/Shield_Tactics.png",
    tooltip: "img/tooltips/Shield_Tactics.png",
    wiki: "https://lotro-wiki.com/wiki/Shield_Tactics"
  },
  "1212": {
    name: "Wall of Steel",
    description: "Damage",
    sequence: [1, 2, 1, 2],
    icon: "img/icons/Wall_of_Steel.png",
    tooltip: "img/tooltips/Wall_of_Steel.png",
    wiki: "https://lotro-wiki.com/wiki/Wall_of_Steel"
  },
  "1321": {
    name: "Adroit Manoeuvre",
    description: "Damage + Buff",
    sequence: [1, 3, 2, 1],
    icon: "img/icons/Adroit_Manoeuvre.png",
    tooltip: "img/tooltips/Adroit_Manoeuvre.png",
    wiki: "https://lotro-wiki.com/wiki/Adroit_Manoeuvre"
  },
  "3123": {
    name: "Resolution",
    description: "AoE Morale-tap",
    sequence: [3, 1, 2, 3],
    icon: "img/icons/Resolution.png",
    tooltip: "img/tooltips/Resolution.png",
    wiki: "https://lotro-wiki.com/wiki/Resolution"
  },
  "2121": {
    name: "Celebration of Skill",
    description: "Damage + Heal",
    sequence: [2, 1, 2, 1],
    icon: "img/icons/Celebration_of_Skill.png",
    tooltip: "img/tooltips/Celebration_of_Skill.png",
    wiki: "https://lotro-wiki.com/wiki/Celebration_of_Skill"
  },
  "2323": {
    name: "Dance of War",
    description: "Buff",
    sequence: [2, 3, 2, 3],
    icon: "img/icons/Dance_of_War.png",
    tooltip: "img/tooltips/Dance_of_War.png",
    wiki: "https://lotro-wiki.com/wiki/Dance_of_War"
  },

  // 5-Builder Gambits
  "12312": {
    name: "Unerring Strike",
    description: "Damage + DoT",
    sequence: [1, 2, 3, 1, 2],
    icon: "img/icons/Unerring_Strike.png",
    tooltip: "img/tooltips/Unerring_Strike.png",
    wiki: "https://lotro-wiki.com/wiki/Unerring_Strike"
  },
  "13213": {
    name: "Warden's Triumph",
    description: "Damage + Buff",
    sequence: [1, 3, 2, 1, 3],
    icon: "img/icons/Wardens_Triumph.png",
    tooltip: "img/tooltips/Wardens_Triumph.png",
    wiki: "https://lotro-wiki.com/wiki/Wardens_Triumph"
  },
  "23232": {
    name: "Conviction",
    description: "AoE Heal + HoT + Buff",
    sequence: [2, 3, 2, 3, 2],
    icon: "img/icons/Conviction.png",
    tooltip: "img/tooltips/Conviction.png",
    wiki: "https://lotro-wiki.com/wiki/Conviction"
  },
  "12131": {
    name: "The Dark Before Dawn",
    description: "Damage + Power",
    sequence: [1, 2, 1, 3, 1],
    icon: "img/icons/The_Dark_Before_Dawn.png",
    tooltip: "img/tooltips/The_Dark_Before_Dawn.png",
    wiki: "https://lotro-wiki.com/wiki/The_Dark_Before_Dawn"
  },
  "21212": {
    name: "Restoration",
    description: "Damage + Heal + HoT",
    sequence: [2, 1, 2, 1, 2],
    icon: "img/icons/Restoration.png",
    tooltip: "img/tooltips/Restoration.png",
    wiki: "https://lotro-wiki.com/wiki/Restoration"
  },
  "31313": {
    name: "Desolation",
    description: "AoE Damage + DoT",
    sequence: [3, 1, 3, 1, 3],
    icon: "img/icons/Desolation.png",
    tooltip: "img/tooltips/Desolation.png",
    wiki: "https://lotro-wiki.com/wiki/Desolation"
  },
  "12121": {
    name: "Cauterizing Steel",
    description: "Damage + Cashout",
    sequence: [1, 2, 1, 2, 1],
    icon: "img/icons/Cauterizing_Steel.png",
    tooltip: "img/tooltips/Cauterizing_Steel.png",
    wiki: "https://lotro-wiki.com/wiki/Cauterizing_Steel"
  },
  "13131": {
    name: "Unseen Strikes",
    description: "AoE Damage + Cashout",
    sequence: [1, 3, 1, 3, 1],
    icon: "img/icons/Unseen_Strikes.png",
    tooltip: "img/tooltips/Unseen_Strikes.png",
    wiki: "https://lotro-wiki.com/wiki/Unseen_Strikes"
  },
  "31232": {
    name: "Exultation of Battle",
    description: "AoE Morale-tap",
    sequence: [3, 1, 2, 3, 2],
    icon: "img/icons/Exultation_of_Battle.png",
    tooltip: "img/tooltips/Exultation_of_Battle.png",
    wiki: "https://lotro-wiki.com/wiki/Exultation_of_Battle"
  }
};

/**
 * Mastery Map: Maps mastery IDs to their sequence pairs
 */
const MASTERY_MAP = {
  "11": [1, 1], "12": [1, 2], "13": [1, 3],
  "21": [2, 1], "22": [2, 2], "23": [2, 3],
  "31": [3, 1], "32": [3, 2], "33": [3, 3]
};
