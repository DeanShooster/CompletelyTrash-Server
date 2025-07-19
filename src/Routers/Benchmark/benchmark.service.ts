import axios from "axios";

import { ENCOUNTER, ERROR_MESSAGES } from "../../constants/enum";
import { accountIds } from "../../constants";

interface IBadGolemLog{
    log: string;
    reason: string;
}

export const golemLogValidator = async (logs: string[]) => {
    try{
        const goodLogs: string[] = [] , badLogs: IBadGolemLog[] = [];
        for(const log of logs){
            try{
                const response = await axios.get(log);
                const _logData = response.data;
                const jsonMatch = _logData.match(/const _logData = (\{.*?\});/s);
                const parsedLog = JSON.parse(jsonMatch[1]);
    
                if(!parsedLog.success){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_NOT_A_KILL_LOG });
                    continue;
                }

                if(parsedLog.targets[0].health !== ENCOUNTER.GOLEM_HEALTH){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_GOLEM_HEALTH_MISMATCH });
                    continue;
                }

                if(parsedLog.triggerID !== ENCOUNTER.STANDARD_GOLEM){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_GOLEM });
                    continue;
                }

                if(!accountIds.includes(parsedLog.players[0].acc)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_PLAYER_NOT_FOUND });
                    continue;
                }

                if(Object.values(parsedLog.skillMap).some((skill : any) => skill.id === ENCOUNTER.MUSHROOM_GOLEM_BLESSING)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_MUSHROOM_BLESSING });
                    continue;
                }

                if(Object.values(parsedLog.buffMap).some((buff : any) => buff.id === ENCOUNTER.POWER_WRIT_200 || 
                                    buff.id === ENCOUNTER.POWER_WRIT_160 || 
                                    buff.id === ENCOUNTER.CONDI_WRIT_200 || 
                                    buff.id === ENCOUNTER.CONDI_WRIT_160)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_WRITS });
                    continue;
                }

                if(!areBoonsValidForProffession(parsedLog)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_BOONS });
                    continue;
                }

                if(!areConditionsValidForProffession(parsedLog)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_CONDITIONS });
                    continue;
                }

            }
            catch(e){
                badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID });
                continue;
            }
        }

        return { goodLogs , badLogs };
        // Check user boons ~ logJson["phases"][0]["buffsStatContainer"] / "boons" / buffMap
        // Check golem conditions ~ logJson["phases"][0]["targetsCondiUptimes"] / "conditions" / buffMap
        // Check DPS ~ phases[0] > duration compute to seconds.
        // Edge cases like minions and etc...
        // Edge cases check illegal precasts
    }
    catch(e){
        // if (axios.isAxiosError(e)) return { error: ERROR_MESSAGES.DPS_REPORT_INVALID,log };
    }
}

function areBoonsValidForProffession(parsedLog: any){
    const profession = parsedLog.players[0].profession;

    console.log(parsedLog.phases[0].buffsStatContainer.boonStats[0].data.length);
    console.log(parsedLog.boons.length);
    // console.log(Object.values(parsedLog.buffMap));

    switch(profession){
        case 'Berserker':{
            // 
            break;
        }
    }

    return true;
}

function areConditionsValidForProffession(parsedLog: any){
    const profession = parsedLog.players[0].profession;

    return true;
}