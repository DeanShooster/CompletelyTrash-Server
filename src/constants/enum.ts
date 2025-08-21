export enum ERROR_MESSAGES {
  DPS_REPORT_INVALID = "DPS Report Parse Error",
  DPS_REPORT_DPS_CALCULATION_ERROR = "DPS Calculation Error",
  DPS_REPORT_NOT_A_KILL_LOG = "Not a Kill Log",
  DPS_REPORT_NOT_A_SOLO_LOG = "Not a Solo Log",
  DPS_REPORT_PLAYER_NOT_FOUND = "Player Not Found",
  DPS_REPORT_BOSS_NOT_FOUND = "Boss Not Found",
  DPS_REPORT_GOLEM_HEALTH_MISMATCH = "Invalid Log - Golem Health Mismatch",
  DPS_REPORT_INVALID_GOLEM = "Invalid Log - Golem hitbox Size",
  DPS_REPORT_LATE_START = "Invalid Log - Late Start",
  DPS_REPORT_WRITS = "Inflated Log - Writs Usage Detected",
  DPS_REPORT_INVALID_BOONS = "Inflated Log - Invalid Boons Detected",
  DPS_REPORT_INVALID_BUFFS = "Inflated Log - Invalid Buffs Detected",
  DPS_REPORT_INVALID_CONDITIONS = "Inflated Log - Invalid Condition/Boons Used on Golem",
  DPS_REPORT_MUSHROOM_BLESSING = "Inflated Log - Mushroom Golem Blessing Detected",
  DPS_REPORT_THIEF_GUILD_USEAGE = "Inflated Log - Thief Guild Detected",
  DPS_REPORT_INVALID_MINION = "Inflated Log - Invalid Minion Detected",
  DPS_REPORT_ELEMENTALIST_MINIONS = "Inflated Log - Elementalist Lesser Minions Detected",
  DPS_REPORT_BUGGED_SPEC = "Invalid Log - Bugged Specialization Detected",
  DPS_REPORT_RACIAL_ELITE_SKILL = "Inflated Log - Racial Elite Skill Detected",
  BAD_REQUEST = "Bad Request",
  USER_ALREADY_EXIST = "User Already Exist",
  SERVER_ERROR = "Something Went Wrong",
  NOT_FOUND = "Not Found",
  FORBIDDEN = "Forbidden",
  NO_ACCESS = "No Access",
  GENERAL_ERROR = "Something Went Wrong",
}

export enum DISCORD_MESSAGES{
  COLOR = "#ff8800",
  UPDATE_COMP = "Full Clear Comp Update",
  UPLOAD_LOG_PROCESSOR = "Upload Logs Processor",
  FAIL_BENCHMARK = "Upload Benchmark Failure",
  BENCH_DOES_NOT_EXIST = "I'm sorry! This benchmark doesnt exist in the Database list yet.",
  BENCH_ALREADY_EXIST = "A better or similar benchmark already exist.",
  FULL_CLEAR_LOGS = "Full Clear - Logs have been uploaded successfully.",
  THUMBNAIL_URL = "https://dean-general-archive.s3.eu-west-1.amazonaws.com/Completely+Trash/logo.png",
  PARSE_TITLE = "Parsed Logs",
  PARSE_FAIL_TITLE = "Failed to Parse",
  RECRUITMENT = "Recruitment",
  LOWMEN_URL="https://dean-general-archive.s3.eu-west-1.amazonaws.com/Completely+Trash/Lowmen.jpg",
  FULL_CLEAR_URL="https://dean-general-archive.s3.eu-west-1.amazonaws.com/Completely+Trash/Full+Clear.jpg"
}

export enum ENCOUNTER{
  STANDARD_GOLEM = 16199,
  MEDIUM_GOLEM = 19645,
  GOLEM_HEALTH = 4000000,
  POWER_WRIT_200 = 33297,
  POWER_WRIT_160 = 32044,
  CONDI_WRIT_200 = 33836,
  CONDI_WRIT_160 = 31959,
  MUSHROOM_GOLEM_BLESSING = 46970,
  ALACRITY_ID = 30328,
  QUICKNESS_ID = 1187,
  STABILITY_ID = 1122,
  FEAR_ID = 791,
  DAMAGE_BONUS_5_PERCENT_ID = 10493,
  EMBER_POWDER_MINION = "Ember",
  RAVEN_MINION = "Raven Spirit Shadow",
  CANNON_MINION = "Cannon",
  JADE_MINION = "Jade Armor",
  MORTAR_MINION = "Mortar",
  TURRET_MINION = "Seed Turret",
  MELANDRU_MINION = "Melandru's Stalker",
  SUNSPEAR_MINION = "Sunspear Paragon Support",
  BLOOD_LEGION_MINION = "Blood Legion Marksman",
  HOUND_MINION = "Hound of Balthazar",
  WOLF_MINION = "Mistfire Wolf",
  ARTILLERY_BARRAGE = "Artillery Barrage",
  CHARRZOOKA = "Charrzooka",
  SLYVAN_HOUND = "Sylvan Hound",
  GOLEM_MINION = "SYN-D111",
  DRUID_MINION = "Druid Spirit",
  SNOW_WURM = "Snow Wurm",
  SEED_TURRET = "Seed Turret",
  REAPER_OF_GRENTH = "Reaper of Grenth",
  MECHANIST = "Jade Mech CJ-1",
  FEROCIOUS_SLB = "Ferocious",
  TOME_OF_JUSTICE = "Tome of Justice"
}

export const FOOD_SWAP_IDS = [25631,25632,25630,64528,10104,10105,10106,10107,10109,10110];

export enum ENCOUNTER_UPTIME{
  STABILITY_UPTIME = 35,
  BOON_UPTIME = 45
}

export enum SPECS {
  Berserker = "Berserker",
  Spellbreaker = "Spellbreaker",
  Bladesworn = "Bladesworn",

  Dragonhunter = "Dragonhunter",
  Firebrand = "Firebrand",
  Willbender = "Willbender",

  Herald = "Herald",
  Renegade = "Renegade",
  Vindicator = "Vindicator",

  Druid = "Druid",
  Soulbeast = "Soulbeast",
  Untamed = "Untamed",

  Daredevil = "Daredevil",
  Deadeye = "Deadeye",
  Specter = "Specter",

  Scrapper = "Scrapper",
  Holosmith = "Holosmith",
  Mechanist = "Mechanist",

  Scourge = "Scourge",
  Harbinger = "Harbinger",
  Reaper = "Reaper",

  Tempest = "Tempest",
  Weaver = "Weaver",
  Catalyst = "Catalyst",
  
  Chronomancer = "Chronomancer",
  Mirage = "Mirage",
  Virtuoso = "Virtuoso",
};