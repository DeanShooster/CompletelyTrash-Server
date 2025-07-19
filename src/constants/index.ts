import { DMChannel, NewsChannel, TextChannel, ThreadChannel } from "discord.js";

export const clientURL = "https://completely-trash.com";

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
  'Dean.3056', 'Steiner.8365', 'MoonMoon.3826', 'rikje.8315', 'Vera.6891'
];