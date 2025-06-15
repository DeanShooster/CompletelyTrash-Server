import express from "express";
import { Request, Response, NextFunction } from "express";

import FullClear from "../../database/models/FullClear";
import FullClearStats from "../../database/models/FullClearStats";

import { routing } from "..";
import { AdminAuth } from "../../middlewares/Authentication";
import { IKillLog, parseKillLog } from "./fullclear.service";

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

        res.send({bossKillsData, errorLogs});
    }
    catch(e){
        next(e);
    }
});

export default router;