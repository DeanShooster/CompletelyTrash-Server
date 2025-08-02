import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';

import { isDpsReportUrl } from '../regex';

import Benchmark from '../database/models/Benchmark';

import { golemLogValidator } from '../Routers/Benchmark/benchmark.service';
import { Proffessions } from '../constants';
import { DISCORD_MESSAGES } from '../constants/enum';

// Discord Bot Connection
export const discordClient = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]
});

export const initDiscordBot = async () => {
    discordClient.login(process.env.DISCORD_BOT_TOKEN);

    discordClient.on("messageCreate", async (message) => {
        if(message.channelId !== process.env.DISCORD_BENCHMARK_ID || message.channelId !== process.env.DISCORD_LN_BENCHMARK_ID) return;
        
        try{
            const urls = message.content.match(isDpsReportUrl);
            if (!urls || urls.length === 0) return;

            const {goodLogs, badLogs} = await golemLogValidator(urls);

            for(const goodLog of goodLogs){
                const benchmark = await Benchmark.findOne({proffessionId: Proffessions.indexOf(goodLog.proffession) ,isPower: goodLog.isPower , type: goodLog.type});
                if(benchmark){
                    const playerIndex = benchmark.players.findIndex(player => player.name === goodLog.name);
                    if(playerIndex === -1) benchmark.players.push({name: goodLog.name, benchNumber: goodLog.benchmark, log: goodLog.log})
                    else{
                        if(benchmark.players[playerIndex].benchNumber < goodLog.benchmark){
                            benchmark.players[playerIndex].benchNumber = goodLog.benchmark;
                            benchmark.players[playerIndex].log = goodLog.name;
                        } else await message.reply(DISCORD_MESSAGES.BENCH_ALREADY_EXIST);
                    }
                    await benchmark.save();
                }else{
                    await message.react('❓');
                    await message.reply(DISCORD_MESSAGES.BENCH_DOES_NOT_EXIST);
                }
            }

            if (goodLogs.length === 0) await message.react('❌');
            if (goodLogs.length > 0) await message.react('✅');

            if(badLogs.length > 0){
                const errorCombinedMsg: string[] = [];
                for(let i = 0; i < badLogs.length; i++) errorCombinedMsg.push(`${badLogs[i].reason}\n${badLogs[i].log}`);
                const embed = new EmbedBuilder()
                    .setColor(DISCORD_MESSAGES.COLOR)
                    .setTitle(DISCORD_MESSAGES.FAIL_BENCHMARK)
                    .setDescription(`${errorCombinedMsg.join('\n')}\n${errorCombinedMsg.length > 1 ? errorCombinedMsg.join('\n') : ''}`)
                    .addFields({ name: 'Error Logs' , value: `${errorCombinedMsg.length}` , inline: true })
                    .setThumbnail(DISCORD_MESSAGES.THUMBNAIL_URL)
                
                await message.reply({ embeds: [embed] });
            }
        }
        catch(e){
            
        }
    })
}
