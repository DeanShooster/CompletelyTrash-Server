import mongoose from "mongoose";

import cTDBConnection from "../connection";

const ErrorLogSchema = new mongoose.Schema({
    status: { type: Number , required: true },
    source: { type: String , required: true },
    message: { type: String , required: true },
    details: { type: String , required: true },
}, {
    timestamps: true,
});

const ErrorLog = cTDBConnection.model("ErrorLog", ErrorLogSchema);
export default ErrorLog;