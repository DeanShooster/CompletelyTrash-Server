import axios from "axios";

import { ENCOUNTER, ENCOUNTER_UPTIME, ERROR_MESSAGES, FOOD_SWAP_IDS, SPECS } from "../../constants/enum";
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

                if(parsedLog.players.length > 1){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_NOT_A_SOLO_LOG });
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

                if(parsedLog.players[0].details.dmgDistributions[0].totalDamage < ENCOUNTER.GOLEM_HEALTH * 0.99){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_LATE_START });
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

                if(Object.values(parsedLog.buffMap).some((buff : any) => buff.id === ENCOUNTER.DAMAGE_BONUS_5_PERCENT_ID || FOOD_SWAP_IDS.includes(buff.id))){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_BUFFS });
                    continue;
                }

                const benchType = getBenchType(parsedLog); 

                if(!areBoonsValidForProffession(parsedLog,isPower, (benchType === 'Quickness' || benchType === 'Alacrity'))){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_BOONS });
                    continue;
                }

                if(!areConditionsValidForProffession(parsedLog,isPower)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_CONDITIONS });
                    continue;
                }

                const benchmark = computeBenchmark(parsedLog.encounterDuration,parsedLog.players[0].details.dmgDistributions[0].totalDamage);
                if(benchmark < 0){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_DPS_CALCULATION_ERROR });
                    continue;
                }

                const edgeCase = isEdgeCaseDetected(parsedLog,isPower)

                if(edgeCase){
                    badLogs.push({log , reason: edgeCase });
                    continue;
                }

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
        if(isPower === false && profession === SPECS.Mirage) return true; // Specific cases for Medium Golem
        return false;
    }
    if(parsedLog.triggerID === ENCOUNTER.STANDARD_GOLEM) return true;
    return false;
}

function areBoonsValidForProffession(parsedLog: any,isPower: boolean, isBoon: boolean){
    const profession = parsedLog.players[0].profession;

    const playerBoons = parsedLog.boons;
    const playerBoonsUpTime = parsedLog.phases[0].buffsStatContainer.boonStats[0].data;

    switch(profession){
        case SPECS.Berserker: return true;
        case SPECS.Spellbreaker: return true;
        case SPECS.Bladesworn: return permaBoonValidator(playerBoonsUpTime);

        case SPECS.Dragonhunter: return permaBoonValidator(playerBoonsUpTime);
        case SPECS.Firebrand: {
            if(isBoon) return permaBoonValidator(playerBoonsUpTime);
            return true;
        }
        case SPECS.Willbender: return permaBoonValidator(playerBoonsUpTime);

        case SPECS.Herald: return true;
        case SPECS.Vindicator: return true;
        case SPECS.Renegade: return true;

        case SPECS.Druid: return true;
        case SPECS.Soulbeast: return true;
        case SPECS.Untamed: return true;

        case SPECS.Daredevil: return true;
        case SPECS.Deadeye: return permaBoonValidator(playerBoonsUpTime);
        case SPECS.Specter: return true;

        case SPECS.Scrapper: {
            if(isPower){
                const indexOfStability = playerBoons.indexOf(ENCOUNTER.STABILITY_ID);
                if(indexOfStability === -1) return true;
                if(playerBoonsUpTime[indexOfStability].some((uptime: number) => uptime > ENCOUNTER_UPTIME.STABILITY_UPTIME)) return false;
            }
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
    }
}

function areConditionsValidForProffession(parsedLog: any, isPower: boolean){
    const profession = parsedLog.players[0].profession;

    const golemConditions = parsedLog.conditions;
    const golemConditionsUpTime = parsedLog.phases[0].buffsStatContainer.targetsCondiUptimes[0].data;
    const golemBoonsUptime = parsedLog.phases[0].buffsStatContainer.targetsBoonUptimes[0].data;

    switch(profession){
        case SPECS.Berserker: {
            if(isPower){
                for(const boon of golemBoonsUptime)
                    if(boon.some((uptime: number) => uptime > 0)) return false;
            }
            return true;
        }
        case SPECS.Spellbreaker: return true;
        case SPECS.Bladesworn: {
            if(isPower){
                for(const boon of golemBoonsUptime)
                    if(boon.some((uptime: number) => uptime > 0)) return false;
            }
            return true;
        }

        case SPECS.Dragonhunter: return true;
        case SPECS.Firebrand: return true;
        case SPECS.Willbender: return true;

        case SPECS.Herald: return true;
        case SPECS.Vindicator: return true;
        case SPECS.Renegade: return true;

        case SPECS.Druid: return true;
        case SPECS.Soulbeast: return true;
        case SPECS.Untamed: return true;

        case SPECS.Daredevil: return permaConditionValidator(golemConditionsUpTime);
        case SPECS.Deadeye: return permaConditionValidator(golemConditionsUpTime);
        case SPECS.Specter: return permaConditionValidator(golemConditionsUpTime);

        case SPECS.Scrapper: {
            if(isPower) return permaConditionValidator(golemConditionsUpTime);
            return true;
        }
        case SPECS.Holosmith: {
            if(isPower) return permaConditionValidator(golemConditionsUpTime);
            return true;
        }
        case SPECS.Mechanist: {
            if(isPower) return permaConditionValidator(golemConditionsUpTime);
            return true;
        }

        case SPECS.Scourge: return permaConditionValidator(golemConditionsUpTime);
        case SPECS.Harbinger: {
            if(!isPower) return permaConditionValidator(golemConditionsUpTime);
            return true;
        }
        case SPECS.Reaper:{
            if(!isPower) return permaConditionValidator(golemConditionsUpTime);
            return true;
        }

        case SPECS.Tempest: return true;
        case SPECS.Weaver: return true;
        case SPECS.Catalyst: return true;

        case SPECS.Chronomancer: {
            if(isPower){
                if(golemConditions.some((condition: number) => condition === ENCOUNTER.FEAR_ID)) return false;
                return true;
            }
            return true;
        }
        case SPECS.Mirage: {
            if(isPower && golemConditions.some((condition: number) => condition === ENCOUNTER.FEAR_ID)) return false;
            return true;
        }
        case SPECS.Virtuoso: {
            if(isPower && golemConditions.some((condition: number) => condition === ENCOUNTER.FEAR_ID)) return false;
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

    if(parsedLog.phases[0].buffsStatContainer.boonGenSelfStats[0].data[indexOfAlac].some((uptime: number) => uptime >= ENCOUNTER_UPTIME.BOON_UPTIME)) return 'Alacrity';
    if(parsedLog.phases[0].buffsStatContainer.boonGenSelfStats[0].data[indexOfQuick].some((uptime: number) => uptime >= ENCOUNTER_UPTIME.BOON_UPTIME)) return 'Quickness';
    return 'DPS';
}

function permaBoonValidator(playerBoons: any){
    let permaBoons = 0;
    for(const boon of playerBoons){
        if(boon.some((uptime: number) => uptime >= 99)) permaBoons++;
    }
    if(permaBoons > 10) return false;
    return true;
}

function permaConditionValidator(golemConditions: any){
    let permaConditions = 0;
    for(const condition of golemConditions){
        if(condition.some((uptime: number) => uptime >= 99)) permaConditions++;
    }
    if(permaConditions > 10) return false;
    return true;
}

function hasInvalidMinions(parsedLog: any){
    if(parsedLog.players[0].minions.some((minion: any) => minion.name === ENCOUNTER.EMBER_POWDER_MINION || minion.name === ENCOUNTER.RAVEN_MINION || minion.name === ENCOUNTER.CANNON_MINION
    || minion.name === ENCOUNTER.JADE_MINION || minion.name === ENCOUNTER.MORTAR_MINION || minion.name === ENCOUNTER.TURRET_MINION || minion.name === ENCOUNTER.MELANDRU_MINION || minion.name === ENCOUNTER.SUNSPEAR_MINION
    || minion.name === ENCOUNTER.HOUND_MINION || minion.name === ENCOUNTER.BLOOD_LEGION_MINION || minion.name === ENCOUNTER.WOLF_MINION || minion.name === ENCOUNTER.SLYVAN_HOUND
    || minion.name === ENCOUNTER.GOLEM_MINION || minion.name === ENCOUNTER.DRUID_MINION || minion.name === ENCOUNTER.SNOW_WURM || minion.name === ENCOUNTER.SEED_TURRET
    ))
    return true;
    return false;
}

function hasUsedRacialEliteSkill(parsedLog: any){
    return Object.values(parsedLog.skillMap).some((skill : any) => skill.name === ENCOUNTER.ARTILLERY_BARRAGE || skill.name === ENCOUNTER.CHARRZOOKA || skill.name === ENCOUNTER.REAPER_OF_GRENTH);
}

function isEdgeCaseDetected(parsedLog: any, isPower: boolean){
    const profession = parsedLog.players[0].profession;

    if(hasInvalidMinions(parsedLog)) return ERROR_MESSAGES.DPS_REPORT_INVALID_MINION;
    if(hasUsedRacialEliteSkill(parsedLog)) return ERROR_MESSAGES.DPS_REPORT_RACIAL_ELITE_SKILL;

    switch(profession){
        case SPECS.Daredevil:{
            if(!isPower && parsedLog.players[0].minions.length > 0) return ERROR_MESSAGES.DPS_REPORT_THIEF_GUILD_USEAGE;
            return null;
        }
        case SPECS.Catalyst:{
            if(parsedLog.players[0].minions.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Tempest:{
            if(parsedLog.players[0].minions.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Weaver:{
            if(parsedLog.players[0].minions.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Willbender:{
            if(Object.values(parsedLog.buffMap).some((buff: any) => buff.name === ENCOUNTER.TOME_OF_JUSTICE)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Untamed:{
            if(Object.values(parsedLog.buffMap).some((buff: any) => buff.name === ENCOUNTER.FEROCIOUS_SLB)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Druid:{
            if(Object.values(parsedLog.buffMap).some((buff: any) => buff.name === ENCOUNTER.FEROCIOUS_SLB)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Scrapper:{
            if(parsedLog.players[0].minions.some((minion: any) => minion.name.includes(ENCOUNTER.MECHANIST))) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Holosmith:{
            if(parsedLog.players[0].minions.some((minion: any) => minion.name.includes(ENCOUNTER.MECHANIST))) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        default: return null;
    }
}