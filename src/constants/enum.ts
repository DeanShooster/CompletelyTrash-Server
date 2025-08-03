export enum ERROR_MESSAGES {
  DPS_REPORT_INVALID = "DPS Report Parse Error",
  DPS_REPORT_DPS_CALCULATION_ERROR = "DPS Calculation Error",
  DPS_REPORT_NOT_A_KILL_LOG = "Not a Kill Log",
  DPS_REPORT_GOLEM_HEALTH_MISMATCH = "Golem Health Mismatch",
  DPS_REPORT_INVALID_GOLEM = "Invalid Golem hitbox",
  DPS_REPORT_PLAYER_NOT_FOUND = "Player Not Found",
  DPS_REPORT_WRITS = "Writs Used",
  DPS_REPORT_INVALID_BOONS = "Invalid Boons Used",
  DPS_REPORT_INVALID_CONDITIONS = "Invalid Conditions Used",
  DPS_REPORT_MUSHROOM_BLESSING = "Mushroom Golem Blessing Used",
  DPS_REPORT_BOSS_NOT_FOUND = "Boss Not Found",
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
  QUICKNESS_ID = 1187
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