import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { routing } from "..";
import { ServerError } from "../../middlewares/ErrorHandler";
import { ERROR_MESSAGES } from "../../constants/enum";
import { AdminAuth } from "../../middlewares/Authentication";

const router = express.Router();

// --------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

router.get(`${routing.admin.auth}`,AdminAuth, async (req: Request, res: Response, next: NextFunction) =>{
    try{
        res.send({token: req.headers.token});
    }
    catch(e){
        next(e);
    }
});

// --------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //

router.post(`${routing.admin.login}`, async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const { adminPassword } = req.body;
        if(adminPassword && adminPassword === process.env.ADMIN_SECRET){
            const token = jwt.sign({ adminPassword }, process.env.SECRET || '' , { expiresIn: "30d" });
            res.send({ token });
        } else return next(new ServerError(ERROR_MESSAGES.NO_ACCESS, 403, routing.admin.login));
    }
    catch(e){
        next(e);
    }
});

export default router;