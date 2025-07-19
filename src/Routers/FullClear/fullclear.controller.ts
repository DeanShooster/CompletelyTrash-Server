import express from "express";
import { Request, Response, NextFunction } from "express";

import { discordClient } from "../../discord";
import { EmbedBuilder } from 'discord.js';

import FullClear from "../../database/models/FullClear";
import FullClearStats from "../../database/models/FullClearStats";

import { routing } from "..";
import { AdminAuth } from "../../middlewares/Authentication";
import { IKillLog, parseKillLog, secondsToTimeString } from "./fullclear.service";
import { DISCORD_MESSAGES } from "../../constants/enum";
import { clientURL, DiscordTextChannel } from "../../constants";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${routing.fullClear.baseURL}`, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const fullClearComp = await FullClear.find().select(['-_id','-__v']);
        res.send(fullClearComp);
    }
    catch(e) {
        next(e);
    }
});

router.get(`${routing.fullClear.fullClearStats}`, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const fullClearStas = await FullClearStats.find().select(['-_id','-__v']);
        res.send(fullClearStas);
    }
    catch(e) {
        next(e);
    }
});

// --------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${routing.fullClear.fullClearStats}/logs`, AdminAuth , async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { logs , patchId } = req.body;
        const fullClearStas = await FullClearStats.find(); 

        const bossKillsData: IKillLog[] = [], errorLogs: IKillLog[] = [];
        for(let i = 0; i < logs.length; i++){
            const parsedLog = await parseKillLog(logs[i]);
            if(parsedLog.bossId === -1 || parsedLog.wingId === -1) errorLogs.push(parsedLog);
            if(parsedLog.bossId >= 0) bossKillsData.push(parsedLog);
        }

        for(let i = 0; i < bossKillsData.length; i++){
            const bossKill = bossKillsData[i];
            (fullClearStas[bossKill.wingId].kills[patchId].boss[bossKill.bossId] as any).push({
                bossId: bossKill.bossId,
                killTime: bossKill.killTime,
                log: bossKill.log,
            });
        }
        for (const doc of fullClearStas) await doc.save();

        const parsedLogsCombingedMsg = [`**__${DISCORD_MESSAGES.PARSE_TITLE}__**`], errorCombinedMsg = [`**__${DISCORD_MESSAGES.PARSE_FAIL_TITLE}__**`];
            if(bossKillsData.length > 0)
                for(let i = 0; i < bossKillsData.length; i++) parsedLogsCombingedMsg.push(`${bossKillsData[i].log}  \`\`${secondsToTimeString(bossKillsData[i].killTime)}\`\``);
        if(errorLogs.length > 0)
            for(let i = 0; i < errorLogs.length; i++) errorCombinedMsg.push(`${errorLogs[i].error}\n${errorLogs[i].log}`);


        const embed = new EmbedBuilder()
                .setColor(DISCORD_MESSAGES.COLOR)
                .setTitle(DISCORD_MESSAGES.UPLOAD_LOG_PROCESSOR)
                .setURL(`${clientURL}/full-clear-stats`)
                .setDescription(`${DISCORD_MESSAGES.FULL_CLEAR_LOGS}\n
                    ${parsedLogsCombingedMsg.join('\n')}\n
                    ${errorCombinedMsg.length > 1 ? errorCombinedMsg.join('\n') : ''}`)
                .addFields(
                    { name: 'Archive', value: 'Success', inline: true },
                    { name: 'Error Logs' , value: `${errorLogs.length}` , inline: true }
                )
                .setThumbnail(DISCORD_MESSAGES.THUMBNAIL_URL)
                .setTimestamp();

        const channel = discordClient.channels.cache.get(`${process.env.DISCORD_COMPETITIVE_CHANNEL_ID}`);
        if (channel?.isTextBased()) await (channel as DiscordTextChannel).send({embeds: [embed]});

        res.send({bossKillsData, errorLogs});
    }
    catch(e){
        next(e);
    }
});

export default router;