import express from "express";
import cors from "cors";

import { Client, GatewayIntentBits } from 'discord.js';

import { ErrorHandler } from "./middlewares/ErrorHandler";
import GeneralRouter from './Routers/General/general.controller';
import FullClearRouter from './Routers/FullClear/fullclear.controller';

// Init
const app = express();
const port = process.env.PORT || 4000;

// Cors white list and JSON
app.use(cors());
app.use(express.json());

// Routers
app.use(GeneralRouter);
app.use(FullClearRouter);
app.use(ErrorHandler);

// Discord Bot Connection
export const discordClient = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);

app.listen(port, async () => console.log(`Server is online on Port: ${port}`));
