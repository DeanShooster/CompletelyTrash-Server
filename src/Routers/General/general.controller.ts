import express from "express";
import { Request, Response, NextFunction } from "express";

import General from "../../database/models/General";

import { routing } from "..";
import { AdminAuth } from "../../middlewares/Authentication";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${routing.general.baseURL}`, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const general = await General.find().select(['-_id','-__v']);
        res.send(...general);
    }
    catch(e){
        next(e);
    }
});

// --------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${routing.general.patch}`, AdminAuth , async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { newPatch } = req.body;
        await General.updateOne({}, {$push: {patches: newPatch}});
        res.send({success: true});
    }
    catch(e){
        next(e);
    }
});

router.post(`${routing.general.team}`, AdminAuth , async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { playerId , playerName } = req.body;
        await General.updateOne({}, {$set: { [`players.${playerId}`]: playerName }});
        res.send({success: true});
    }
    catch(e){
        next(e);
    }
});

export default router;