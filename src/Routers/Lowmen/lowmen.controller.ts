import express from "express";
import { Request, Response, NextFunction } from "express";

import Lowmen from "../../database/models/Lowmen";

import { routing } from "..";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${routing.lowmen.baseURL}`, async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const lowmen = await Lowmen.find().select(['-_id','-__v']);
        res.send(lowmen);
    }
    catch(e){
        next(e);
    }
});

export default router;