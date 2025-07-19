import { Client, GatewayIntentBits } from 'discord.js';

import { isDpsReportUrl } from '../regex';

import { golemLogValidator } from '../Routers/Benchmark/benchmark.service';

// Discord Bot Connection
export const discordClient = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]
});

export const initDiscordBot = () => {
    discordClient.login(process.env.DISCORD_BOT_TOKEN);

    discordClient.on("messageCreate", async (message) => {
        if(message.channelId !== process.env.DISCORD_BENCHMARK_ID) return;
        
        try{
            const urls = message.content.match(isDpsReportUrl);

            if (!urls || urls.length === 0) return;

            await golemLogValidator(urls);
        }
        catch(e){

        }
    })
}
