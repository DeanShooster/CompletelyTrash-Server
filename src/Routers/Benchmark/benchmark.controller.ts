import express from "express";
import { Request, Response, NextFunction } from "express";

import { routing } from "..";
import axios from "axios";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.post(`${routing.benchmark.baseURL}`, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const response = await axios.get(req.body.log);
        const _logData = response.data;
        const jsonMatch = _logData.match(/const _logData = (\{.*?\});/s);
        const parsedLog = JSON.parse(jsonMatch[1]);

        console.log(Object.values(parsedLog.skillMap).some((e:any) => e.id === 46970));

        res.send(parsedLog);
    }
    catch(e) {
        next(e);
    }
});

export default router;
