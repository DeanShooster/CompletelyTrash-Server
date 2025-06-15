import axios from "axios";

import { EncounterNames, wingEncounterMapping } from "../../constants";
import { ERROR_MESSAGES } from "../../constants/enum";

export interface IKillLog{
    wingId: number;
    bossId: number;
    killTime: number;
    log: string;
    error?: ERROR_MESSAGES;
}

export const parseKillLog = async (log: string) => {
    try{
        const response = await axios.get(log);
        const _logData = response.data;
        const jsonMatch = _logData.match(/const _logData = (\{.*?\});/s);
        const parsedLog = JSON.parse(jsonMatch[1]);

        if(!parsedLog.success) return { error: ERROR_MESSAGES.DPS_REPORT_NOT_A_KILL_LOG , wingId: -1, bossId: -1, killTime: -1, log };
        if(!EncounterNames.includes(parsedLog.fightNameNoMode)) return { error: ERROR_MESSAGES.DPS_REPORT_BOSS_NOT_FOUND , wingId: -1, bossId: -1, killTime: -1, log };

        const { wingId, bossId } = WingEncounterGetIds(parsedLog.fightNameNoMode);
        const killTime = EncounterKillTimeToSeconds(parsedLog.encounterDuration);

        return {
            wingId: wingId,
            bossId: bossId,
            killTime: killTime,
            log: log
        };
    }
    catch(e){
        if (axios.isAxiosError(e)) return { error: ERROR_MESSAGES.DPS_REPORT_INVALID, wingId: -1, bossId: -1, killTime: -1, log };
        return { error: ERROR_MESSAGES.GENERAL_ERROR, wingId: -1, bossId: -1, killTime: -1, log };
    }
}

export function WingEncounterGetIds(bossName: string){
    for(let i = 0; i < wingEncounterMapping.length; i++)
        for(let j = 0; j < wingEncounterMapping[i].length; j++)
            if(wingEncounterMapping[i][j] === bossName) return { wingId: i, bossId: j };
    return {
        wingId: -1,
        bossId: -1,
    };
};

export function EncounterKillTimeToSeconds(timeString: string){
    const regex = /(?:(\d+)m)?\s*(?:(\d+)s)?\s*(?:(\d+)ms)?/;
    const matches = timeString.match(regex);

    if (!matches) throw new Error('Invalid time format');

    const minutes = matches[1] ? parseInt(matches[1], 10) : 0;
    const seconds = matches[2] ? parseInt(matches[2], 10) : 0;

    return minutes * 60 + seconds;
}