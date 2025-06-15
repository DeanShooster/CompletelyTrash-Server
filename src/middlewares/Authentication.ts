import { Request, Response, NextFunction } from "express";

import { ServerError } from "./ErrorHandler";
import { ERROR_MESSAGES } from "../constants/enum";


export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { adminPassword } = req.body;
    if(adminPassword && adminPassword === process.env.ADMIN_SECRET) return next();
    return next(new ServerError(ERROR_MESSAGES.FORBIDDEN, 403,'AdminAuth'));
  }
  catch(e){
    next(e);
  }
}