import axios from "axios";
import express from "express";
import { Request, Response, NextFunction } from "express";

import Benchmark from "../../database/models/Benchmark";

import { routing } from "..";
import { AdminAuth } from "../../middlewares/Authentication";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${routing.benchmark.baseURL}`, async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const benchmarks = await Benchmark.find().select(['-_id','-__v']);
        res.send(benchmarks);
    }
    catch(e){
        next(e);
    }
});

// --------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${routing.benchmark.baseURL}`,AdminAuth, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const response = await axios.get(req.body.log);
        const _logData = response.data;
        const jsonMatch = _logData.match(/const _logData = (\{.*?\});/s);
        const parsedLog = JSON.parse(jsonMatch[1]);

        res.send(parsedLog);
    }
    catch(e) {
        next(e);
    }
});

// --------------------------------------------------------------- PUT REQUESTS --------------------------------------------------------------- //

router.put(`${routing.benchmark.baseURL}`, AdminAuth,  async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const {name, proffessionId, type, isPower, isUpToDate, benchNumber, log, video, players } = req.body;
        const benchmark = await Benchmark.findOne({ name });
        if(benchmark){
            Object.assign(benchmark, {proffessionId, type, isPower, isUpToDate, benchNumber, log, video, players});
            await benchmark.save();
        }else{
            const newBenchmark = new Benchmark({ name,proffessionId,type,isPower,isUpToDate,benchNumber,log,video,players });
            await newBenchmark.save();
        }
        res.send({name});
    }
    catch(e){
        next(e);
    }
});

export default router;