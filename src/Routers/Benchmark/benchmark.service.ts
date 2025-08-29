import axios from "axios";

import { BOONS_IDS, CONDI_DAMAGE_IDS, CONDI_EFFECT_IDS, ENCOUNTER, ENCOUNTER_UPTIME, ERROR_MESSAGES, FOOD_SWAP_IDS, SPECS } from "../../constants/enum";
import { accountIds, dpsReportURL } from "../../constants";
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
                const response = await axios.get(`${dpsReportURL}${log}`);
                const parsedLog = response.data;
    
                const isPower = parsedLog.players[0].dpsTargets[0][0].powerDps > parsedLog.players[0].dpsTargets[0][0].condiDps;

                if(!parsedLog.success){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_NOT_A_KILL_LOG });
                    continue;
                }

                if(parsedLog.language !== ENCOUNTER.ENGLISH){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_ENGLISH_ERROR });
                    continue;
                }

                if(parsedLog.players.length > 1){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_NOT_A_SOLO_LOG });
                    continue;
                }

                if(parsedLog.targets[0].totalHealth !== ENCOUNTER.GOLEM_HEALTH){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_GOLEM_HEALTH_MISMATCH });
                    continue;
                }
                
                if(!isGolemTypeValid(parsedLog,isPower)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_INVALID_GOLEM });
                    continue;
                }

                if(parsedLog.targets[0].healthPercents[0][1] < 99.15){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_LATE_START });
                    continue;
                }

                if(!accountIds.includes(parsedLog.players[0].account)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_PLAYER_NOT_FOUND });
                    continue;
                }

                if(Object.keys(parsedLog.skillMap).some((skill : any) => skill === ENCOUNTER.MUSHROOM_GOLEM_BLESSING)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_MUSHROOM_BLESSING });
                    continue;
                }

                const KeysBuffMap = Object.keys(parsedLog.buffMap);

                if(KeysBuffMap.some((buffID : any) => buffID === ENCOUNTER.POWER_WRIT_200 || 
                                    buffID === ENCOUNTER.POWER_WRIT_160 || 
                                    buffID === ENCOUNTER.CONDI_WRIT_200 || 
                                    buffID === ENCOUNTER.CONDI_WRIT_160)){
                    badLogs.push({log , reason: ERROR_MESSAGES.DPS_REPORT_WRITS });
                    continue;
                }

                if(KeysBuffMap.some((buffID : any) => buffID === ENCOUNTER.DAMAGE_BONUS_5_PERCENT_ID || FOOD_SWAP_IDS.includes(buffID))){
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

                const benchmark = parsedLog.players[0].dpsTargets[0][0].dps;
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
                    name: parsedLog.players[0].account,
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

    const playerBoonsUpTime = parsedLog.players[0].buffUptimes;

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
                const stabilityUpTime = parsedLog.players[0].buffUptimes.find((buff: any) => buff.id === ENCOUNTER.STABILITY_ID)?.buffData[0];
                if(stabilityUpTime?.presence > ENCOUNTER_UPTIME.STABILITY_UPTIME) return false;
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
    const golemConditions = parsedLog.targets[0].buffs;

    switch(profession){
        case SPECS.Berserker: {
            if(isPower){
                if(golemConditions.some((condition: any) => BOONS_IDS.includes(condition.id))) return false;
            }
            return true;
        }
        case SPECS.Spellbreaker: return true;
        case SPECS.Bladesworn: {
            if(isPower){
                if(golemConditions.some((condition: any) => BOONS_IDS.includes(condition.id))) return false;
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

        case SPECS.Daredevil: return permaConditionValidator(golemConditions);
        case SPECS.Deadeye: return permaConditionValidator(golemConditions);
        case SPECS.Specter: return permaConditionValidator(golemConditions);

        case SPECS.Scrapper: {
            if(isPower) return permaConditionValidator(golemConditions);
            return true;
        }
        case SPECS.Holosmith: {
            if(isPower) return permaConditionValidator(golemConditions);
            return true;
        }
        case SPECS.Mechanist: {
            if(isPower) return permaConditionValidator(golemConditions);
            return true;
        }

        case SPECS.Scourge: return permaConditionValidator(golemConditions);
        case SPECS.Harbinger: {
            if(!isPower) return permaConditionValidator(golemConditions);
            return true;
        }
        case SPECS.Reaper:{
            if(!isPower) return permaConditionValidator(golemConditions);
            return true;
        }

        case SPECS.Tempest: return true;
        case SPECS.Weaver: return true;
        case SPECS.Catalyst: return true;

        case SPECS.Chronomancer: {
            if(isPower){
                if(golemConditions.some((condition: any) => condition.id === ENCOUNTER.FEAR_ID)) return false;
                return true;
            }
            return true;
        }
        case SPECS.Mirage: {
            if(isPower && golemConditions.some((condition: any) => condition.id === ENCOUNTER.FEAR_ID)) return false;
            return true;
        }
        case SPECS.Virtuoso: {
            if(isPower && golemConditions.some((condition: any) => condition.id === ENCOUNTER.FEAR_ID)) return false;
            return true;
        }

        default: return false;
    }
}

function getBenchType(parsedLog : any): benchmarkType{
    if(parsedLog.players[0].profession === SPECS.Reaper) return 'DPS';
    const alacUptime = parsedLog.players[0].buffUptimes.find((buff: any) => buff.id === ENCOUNTER.ALACRITY_ID)?.buffData[0];
    const quickUptime = parsedLog.players[0].buffUptimes.find((buff: any) => buff.id === ENCOUNTER.QUICKNESS_ID)?.buffData[0];

    if(quickUptime?.generated[`${parsedLog.recordedBy}`] >= ENCOUNTER_UPTIME.BOON_UPTIME) return 'Quickness';
    if(alacUptime?.generated[`${parsedLog.recordedBy}`] >= ENCOUNTER_UPTIME.BOON_UPTIME) return 'Alacrity';
    return 'DPS';
}

function permaBoonValidator(playerBoons: any){
    let permaBoons = 0;
    for(const boon of playerBoons){
        if(!BOONS_IDS.includes(boon.id)) continue;
        if(boon.id === ENCOUNTER.MIGHT_ID){
            permaBoons++;
            continue;
        }
        if(boon.id === ENCOUNTER.STABILITY_ID){
            if(boon.buffData[0].presence >= 99) permaBoons++;
            continue;
        }
        if(boon.buffData[0].uptime >= 99) permaBoons++;
    }
    if(permaBoons > 10) return false;
    return true;
}

function permaConditionValidator(golemConditions: any){
    let permaConditions = 0;
    for(const condition of golemConditions){
        const isEffect = CONDI_EFFECT_IDS.includes(condition.id), isDamage = CONDI_DAMAGE_IDS.includes(condition.id);
        if(!isEffect && !isDamage) continue;
        if(isEffect) {
            if(condition.buffData[0].uptime >= 99) permaConditions++;
            continue;
        }
        if(isDamage){
            if(condition.buffData[0].presence >= 99) permaConditions++;
        }
    }
    if(permaConditions > 10) return false;
    return true;
}

function hasInvalidMinions(parsedLog: any){
    if(parsedLog.players[0].minions?.some((minion: any) => minion.name === ENCOUNTER.EMBER_POWDER_MINION || minion.name === ENCOUNTER.RAVEN_MINION || minion.name === ENCOUNTER.CANNON_MINION
    || minion.name === ENCOUNTER.JADE_MINION || minion.name === ENCOUNTER.MORTAR_MINION || minion.name === ENCOUNTER.TURRET_MINION || minion.name === ENCOUNTER.MELANDRU_MINION || minion.name === ENCOUNTER.SUNSPEAR_MINION
    || minion.name === ENCOUNTER.HOUND_MINION || minion.name === ENCOUNTER.BLOOD_LEGION_MINION || minion.name === ENCOUNTER.WOLF_MINION || minion.name === ENCOUNTER.SLYVAN_HOUND
    || minion.name === ENCOUNTER.GOLEM_MINION || minion.name === ENCOUNTER.DRUID_MINION || minion.name === ENCOUNTER.SNOW_WURM || minion.name === ENCOUNTER.SEED_TURRET
    ))
    return true;
    return false;
}

function hasUsedRacialEliteSkill(parsedLog: any){
   return Object.keys(parsedLog.skillMap).some((skill : any) => skill === ENCOUNTER.ARTILLERY_BARRAGE || skill === ENCOUNTER.CHARRZOOKA) ||
          Object.keys(parsedLog.buffMap).some((skill : any) => skill === ENCOUNTER.REAPER_OF_GRENTH)
}

function isEdgeCaseDetected(parsedLog: any, isPower: boolean){
    const profession = parsedLog.players[0].profession;

    if(hasInvalidMinions(parsedLog)) return ERROR_MESSAGES.DPS_REPORT_INVALID_MINION;
    if(hasUsedRacialEliteSkill(parsedLog)) return ERROR_MESSAGES.DPS_REPORT_RACIAL_ELITE_SKILL;

    switch(profession){
        case SPECS.Daredevil:{
            if(!isPower && parsedLog.players[0].minions?.length > 0) return ERROR_MESSAGES.DPS_REPORT_THIEF_GUILD_USEAGE;
            return null;
        }
        case SPECS.Catalyst:{
            if(parsedLog.players[0].minions?.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Tempest:{
            if(parsedLog.players[0].minions?.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Weaver:{
            if(parsedLog.players[0].minions?.some((minion: any) => minion.name.includes("Lesser"))) return ERROR_MESSAGES.DPS_REPORT_ELEMENTALIST_MINIONS;
            return null;
        }
        case SPECS.Willbender:{
            if(Object.keys(parsedLog.buffMap).some((buff: any) => buff === ENCOUNTER.TOME_OF_JUSTICE)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Untamed:{
            if(Object.keys(parsedLog.buffMap).some((buff: any) => buff === ENCOUNTER.FEROCIOUS_SLB)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Druid:{
            if(Object.keys(parsedLog.buffMap).some((buff: any) => buff === ENCOUNTER.FEROCIOUS_SLB)) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Scrapper:{
            if(parsedLog.players[0].minions?.some((minion: any) => minion.name.includes(ENCOUNTER.MECHANIST))) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        case SPECS.Holosmith:{
            if(parsedLog.players[0].minions?.some((minion: any) => minion.name.includes(ENCOUNTER.MECHANIST))) return ERROR_MESSAGES.DPS_REPORT_BUGGED_SPEC;
            return null;
        }
        default: return null;
    }
}