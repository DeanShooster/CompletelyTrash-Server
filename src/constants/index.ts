import { DMChannel, NewsChannel, TextChannel, ThreadChannel } from "discord.js";

export const clientURL = "https://completely-trash.com";
export const dpsReportURL =  "https://dps.report/getJson?permalink=";

export type DiscordTextChannel = TextChannel | DMChannel | NewsChannel | ThreadChannel;

export const EncounterNames: string[] = [
  "Vale Guardian",
  "Gorseval the Multifarious",
  "Sabetha the Saboteur",
  "Slothasor",
  "Matthias Gabrel",
  "Siege the Stronghold",
  "Keep Construct",
  "Twisted Castle",
  "Xera",
  "Cairn",
  "Mursaat Overseer",
  "Samarog",
  "Deimos",
  "Soulless Horror",
  "River of Souls",
  "Dhuum",
  "Conjured Amalgamate",
  "Twin Largos",
  "Qadim",
  "Cardinal Adina",
  "Cardinal Sabir",
  "Qadim the Peerless",
  "Greer, the Blightbringer",
  "Decima, the Stormsinger",
  "Ura, the Steamshrieker"
];

export const Proffessions: string[] = [
  'Berserker',
  'Spellbreaker',
  'Bladesworn',
  'Dragonhunter',
  'Firebrand',
  'Willbender',
  'Herald',
  'Renegade',
  'Vindicator',
  'Druid',
  'Soulbeast',
  'Untamed',
  'Daredevil',
  'Deadeye',
  'Specter',
  'Scrapper',
  'Holosmith',
  'Mechanist',
  'Reaper',
  'Scourge',
  'Harbinger',
  'Tempest',
  'Weaver',
  'Catalyst',
  'Chronomancer',
  'Mirage',
  'Virtuoso'
];

export const wingEncounterMapping: string[][] = [
    ['Vale Guardian', 'Gorseval the Multifarious', 'Sabetha the Saboteur'],
    ['Slothasor','Trio', 'Matthias Gabrel'],
    ['Siege the Stronghold', 'Keep Construct', 'Twisted Castle', 'Xera'],
    ['Cairn', 'Mursaat Overseer', 'Samarog', 'Deimos'],
    ['Soulless Horror', 'River of Souls', 'Eye Of Darkness', 'Broken King', 'Eater Of Souls', 'Dhuum'],
    ['Conjured Amalgamate', 'Twin Largos', 'Qadim'],
    ['Cardinal Sabir', 'Cardinal Adina','Qadim the Peerless'],
    ['Greer, the Blightbringer', 'Decima, the Stormsinger', 'Ura, the Steamshrieker']
];

export const accountIds: string[] = [
  'Verone.7652','Carphunter.6410', 'Pelda.1896', 'Ssalg.1205', 'Unholy Mox.1569', 
  'Dean.3056', 'Steiner.8365', 'MoonMoon.3826', 'rikje.8315', 'pancakecookie.1357',
  'Vertox.3697','MrnousakCz.9650', 'Cemox.7089', 'Hype.5628', 
  'RoyalWabbit.8359', 'Canuqy.1940','Nightmare.5026',"Helli.1279", 'Toilet.8462'
];