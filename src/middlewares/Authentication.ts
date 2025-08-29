import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { ServerError } from "./ErrorHandler";
import { ERROR_MESSAGES } from "../constants/enum";
import { routing } from "../Routers";

export interface IDecodedJwtPayload extends JwtPayload {
  adminPassword: string;
}

export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const token = req.headers.token;
    if(token){
      const decoded = jwt.verify(token as string, process.env.SECRET || '') as IDecodedJwtPayload;
      if(decoded.adminPassword && decoded.adminPassword === process.env.ADMIN_SECRET) return next();
      return next(new ServerError(ERROR_MESSAGES.FORBIDDEN, 403,routing.admin.auth));
    }
    return next(new ServerError(ERROR_MESSAGES.FORBIDDEN, 403,routing.admin.auth));
  }
  catch(e){
    next(e);
  }
}