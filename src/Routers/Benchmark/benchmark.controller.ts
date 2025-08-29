import axios from "axios";
import express from "express";
import { Request, Response, NextFunction } from "express";

import Benchmark from "../../database/models/Benchmark";

import { routing } from "..";
import { AdminAuth } from "../../middlewares/Authentication";
import { ServerError } from "../../middlewares/ErrorHandler";
import { ERROR_MESSAGES } from "../../constants/enum";
import { dpsReportURL } from "../../constants";

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

router.post(`${routing.benchmark.baseURL}`, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const response = await axios.get(`${dpsReportURL}${req.body.log}`);
        res.send(response.data);
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

// --------------------------------------------------------------- DELETE REQUESTS --------------------------------------------------------------- //

router.delete(`${routing.benchmark.baseURL}`, AdminAuth ,async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, fullDelete } = req.body;
        if(fullDelete){
            const benchmark = await Benchmark.findOneAndDelete({ name });
            if(!benchmark) return next(new ServerError(ERROR_MESSAGES.NOT_FOUND,404,routing.benchmark.baseURL));
            res.send({benchmark});
        }else{
            const benchmark = await Benchmark.findOneAndUpdate({ name },{ $set: { players: [] } },{ new: true });
            if(!benchmark) return next(new ServerError(ERROR_MESSAGES.NOT_FOUND,404,routing.benchmark.baseURL));
            res.send({benchmark});
        }
    }
    catch(e){
        next(e);
    }
});

export default router;