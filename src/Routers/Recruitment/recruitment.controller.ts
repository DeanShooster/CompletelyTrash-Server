import express from "express";
import { Request, Response, NextFunction } from "express";

import { routing } from "..";
import { DiscordTextChannel } from "../../constants";
import { DISCORD_MESSAGES } from "../../constants/enum";
import { EmbedBuilder } from "discord.js";
import { discordClient } from "../../discord";

const router = express.Router();

// --------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${routing.recruitment.baseURL}`,async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const { type,accountName, discordName, age, description  } = req.body;

        const embed = new EmbedBuilder()
                .setColor(DISCORD_MESSAGES.COLOR)
                .setTitle(DISCORD_MESSAGES.RECRUITMENT)
                .setDescription(description)
                .addFields(
                    { name: 'Type', value: type, inline: false ,  },
                    { name: 'accountName', value: accountName, inline: false },
                    { name: 'discordName' , value: discordName , inline: false },
                    { name: 'Age' , value: `${age}` , inline: false },
                )
                .setThumbnail(DISCORD_MESSAGES.THUMBNAIL_URL)
                .setImage(type === "Lowmen" ? DISCORD_MESSAGES.LOWMEN_URL : DISCORD_MESSAGES.FULL_CLEAR_URL)
                .setTimestamp();

        const channel = discordClient.channels.cache.get(`${process.env.DISCORD_RECRUITMENT_ID}`);
        if (channel?.isTextBased()) await (channel as DiscordTextChannel).send({embeds: [embed]});

        res.send({});
    }
    catch(e){
        next(e);
    }
});

export default router;