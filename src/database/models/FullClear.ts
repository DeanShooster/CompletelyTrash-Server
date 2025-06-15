import mongoose from "mongoose";

import cTDBConnection from "../connection";

const PlayerSchema = new mongoose.Schema({
    playerId: { type: Number , required: true },
    specId: { type: Number , required: true },
    boonIds: [{ type: Number }],
    mechanics: [{
        id: { type: Number },
        note: { type: String }
    }]
});

const FullClearSchema = new mongoose.Schema({
    wingId: {type: Number, required: true},
    comp: [{
        bossId: { type: Number, required: true },
        sub1: [PlayerSchema],
        sub2: [PlayerSchema],
    }]
});

const FullClear = cTDBConnection.model("FullClear" , FullClearSchema);
export default FullClear;