import axios from "axios";

import { ENCOUNTER, ERROR_MESSAGES, SPECS } from "../../constants/enum";
import { accountIds } from "../../constants";
import { benchmarkType } from "../../database/models/Benchmark";

interface IBadGolemLog{
    log: string;
    reason: string;
}

interface IGooldGolemLog{
    log: string;
    isPower: boolean;
    benchmark: number;
    proffession: string;
    name: string;
    type: benchmarkType;
}

export const golemLogValidator = async (logs: string[]) => {
    try{
        const goodLogs: IGooldGolemLog[] = [] , badLogs: IBadGolemLog[] = [];
        for(const log of logs){
            try{
                const response = await axios.get(log);
                const _logData = response.data;
                const jsonMatch = _logData.match(/const _logData = (\{.*?\});/s);
                const parsedLog = JSON.parse(jsonMatch[1]);
    
                const isPower = parsedLog.phases[0].dpsStats[0][1] > parsedLog.phases[0].dpsStats[0][2];

                if(!parsedLog.success){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_NOT_A_KILL_LOG });
                    continue;
                }

                if(parsedLog.targets[0].health !== ENCOUNTER.GOLEM_HEALTH){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_GOLEM_HEALTH_MISMATCH });
                    continue;
                }

                if(!isGolemTypeValid(parsedLog,isPower)){
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

                // Edge cases like minions and etc...

                // Edge cases check illegal precasts

                // if(!areBoonsValidForProffession(parsedLog)){
                //     badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_BOONS });
                //     continue;
                // }

                // if(!areConditionsValidForProffession(parsedLog)){
                //     badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_CONDITIONS });
                //     continue;
                // }

                const benchmark = computeBenchmark(parsedLog.encounterDuration,parsedLog.players[0].details.dmgDistributions[0].totalDamage);
                if(benchmark < 0){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_DPS_CALCULATION_ERROR });
                    continue;
                }

                const benchType = getBenchType(parsedLog);

                goodLogs.push({
                    log,
                    isPower,
                    benchmark,
                    proffession: parsedLog.players[0].profession,
                    name: parsedLog.players[0].acc,
                    type: benchType
                });
            }
            catch(e){
                badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID });
                continue;
            }
        }

        return { goodLogs , badLogs };
    }
    catch(e){
        return { goodLogs: [] , badLogs: [] }
    }
}

function isGolemTypeValid(parsedLog: any, isPower: boolean){
    if(parsedLog.triggerID === ENCOUNTER.MEDIUM_GOLEM){
        const profession = parsedLog.players[0].profession;
        // Specific cases for Medium Golem
        if(isPower === false && profession === 'Mirage') return true;
    }
    if(parsedLog.triggerID === ENCOUNTER.STANDARD_GOLEM) return true;
    return false;
}

function areBoonsValidForProffession(parsedLog: any){
    const profession = parsedLog.players[0].profession;

    console.log(parsedLog.phases[0].buffsStatContainer.boonStats[0].data.length);
    console.log(parsedLog.boons.length);
    // console.log(Object.values(parsedLog.buffMap));

    switch(profession){
        case SPECS.Berserker: return true;
        case SPECS.Spellbreaker: {
            // No Perma Stability
            return true;
        }
        case SPECS.Bladesworn: {
            // 10 perma boons
            return true;
        }

        case SPECS.Dragonhunter: {
            // 10 perma boons
            return true;
        }
        case SPECS.Firebrand: {
            // 10 perma boons on quickness Condi FB
            return true;
        }
        case SPECS.Willbender: {
            // 10 perma boons
            return true;
        }

        case SPECS.Herald: return true;
        case SPECS.Vindicator: return true;
        case SPECS.Renegade: return true;

        case SPECS.Druid: return true;
        case SPECS.Soulbeast: return true;
        case SPECS.Untamed: return true;

        case SPECS.Daredevil: return true;
        case SPECS.Deadeye: {
            // 10 perma boons
            return true;
        }
        case SPECS.Specter: return true;

        case SPECS.Scrapper: {
            // No Perma Stability
            return true;
        }
        case SPECS.Holosmith: return true;
        case SPECS.Mechanist: return true;

        case SPECS.Scourge: return true;
        case SPECS.Harbinger: return true;
        case SPECS.Reaper: return true;

        case SPECS.Tempest: return true;
        case SPECS.Weaver: return true;
        case SPECS.Catalyst: return true;

        case SPECS.Chronomancer: return true;
        case SPECS.Mirage: return true;
        case SPECS.Virtuoso: return true;

        default: return false;
    }
}

function areConditionsValidForProffession(parsedLog: any){
    const profession = parsedLog.players[0].profession;

    switch(profession){
        case SPECS.Berserker: {
            // Check if golem has boons
            return true;
        }
        case SPECS.Spellbreaker: return true;
        case SPECS.Bladesworn: {
            // Check if golem has boons
            return true;
        }

        case SPECS.Dragonhunter: return true;
        case SPECS.Firebrand: return true;
        case SPECS.Willbender: return true;

        case SPECS.Herald: return true;
        case SPECS.Vindicator: return true;
        case SPECS.Renegade: return true;

        case SPECS.Druid: return true;
        case SPECS.Soulbeast: {
            // 10 condis if hammer
            return true;
        }
        case SPECS.Untamed: {
            // 10 condis if hammer
            return true;
        }

        case SPECS.Daredevil: {
            // 10 condis
            return true;
        }
        case SPECS.Deadeye: {
            // 10 condis
            return true;
        }
        case SPECS.Specter: {
            // 10 condis
            return true;
        }

        case SPECS.Scrapper: {
            // 10 condis if power
            return true;
        }
        case SPECS.Holosmith: {
            // 10 condis if power
            return true;
        }
        case SPECS.Mechanist: {
            // 10 condis if power
            return true;
        }

        case SPECS.Scourge: {
            // 10 condis if condi
            return true;
        }
        case SPECS.Harbinger: {
            // 10 condis if condi
            return true;
        }
        case SPECS.Reaper: {
            // 10 condis if condi
            return true;
        }

        case SPECS.Tempest: return true;
        case SPECS.Weaver: return true;
        case SPECS.Catalyst: return true;

        case SPECS.Chronomancer: {
            // No perma fear, slow ( on power only )
            return true;
        }
        case SPECS.Mirage: {
            // No perma fear
            return true;
        }
        case SPECS.Virtuoso: {
            // No perma fear
            return true;
        }

        default: return false;
    }
}

function computeBenchmark(encounterDuration: string, totalDPS : number){
    const regex = /(?:(\d+)m\s*)?(?:(\d+)s\s*)?(?:(\d+)ms)?/;
    const match = encounterDuration.match(regex);
    
    if (!match) return -1;

    const minutes = parseInt(match[1] || '0', 10), seconds = parseInt(match[2] || '0', 10), milliseconds = parseInt(match[3] || '0', 10);

    const totalSeconds = (minutes * 60) + seconds + (milliseconds / 1000);
    if (totalSeconds === 0) return -1;

    const dps = totalDPS / totalSeconds;
    
    return Math.round(dps);
}

function getBenchType(parsedLog : any): benchmarkType{

    const indexOfAlac = parsedLog.boons.indexOf(ENCOUNTER.ALACRITY_ID);
    const indexOfQuick = parsedLog.boons.indexOf(ENCOUNTER.QUICKNESS_ID);

    if(parsedLog.phases[0].buffsStatContainer.boonGenSelfStats[0].data[indexOfAlac].some((uptime: number) => uptime >= 45)) return 'Alacrity';
    if(parsedLog.phases[0].buffsStatContainer.boonGenSelfStats[0].data[indexOfQuick].some((uptime: number) => uptime >= 45)) return 'Quickness';
    return 'DPS';
}