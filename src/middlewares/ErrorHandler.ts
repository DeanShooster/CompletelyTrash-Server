import { Request, Response, NextFunction } from "express";

import ErrorLog from "../database/models/ErrorLog";

export class ServerError extends Error {
  status: number;
  source: string;

  constructor(message: string, status: number, source: string) {
    super(message);
    this.status = status;
    this.source = source;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ClientError{
  status: number;
  message: string;
  source: string;
  timestamp: Date;
  details: any;

  constructor(status: number, message: string, source: string, timestamp: Date){
    this.status = status;
    this.message = message;
    this.source = source;
    this.timestamp = timestamp;
  }
}

export const ErrorHandler = async (error: any , req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Internal Server Error';
    const source = error.source || 'Unknown Path';

    // Logger for internal server errors only.
    if(statusCode >= 500){
      const newErrorLog = new ErrorLog({status: statusCode, source, message, details: error });
      if(newErrorLog) await newErrorLog.save();
      else console.log("Failed to Log ErrorLog DB",error);
    }

    res.status(statusCode).send(new ClientError(statusCode, message, source, new Date()));
    next();
}
