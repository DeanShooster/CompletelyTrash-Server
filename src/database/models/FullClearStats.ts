import mongoose from "mongoose";

import cTDBConnection from "../connection";

const FullClearStatsSchema = new mongoose.Schema({
    wingId: {type: Number, required: true},
    kills: [{
        patchId: { type: Number, required: true },
        boss: [
            [
                {
                    bossId: { type: Number, required: true },
                    killTime: { type: Number, required: true },
                    log: { type: String, required: true },
                }
            ]
        ]
    }]
});

const FullClearStats = cTDBConnection.model("FullClearStats", FullClearStatsSchema);
export default FullClearStats;