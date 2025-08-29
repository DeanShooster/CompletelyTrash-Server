import mongoose from "mongoose";

import cTDBConnection from "../connection";

const killSchema = new mongoose.Schema({
    killTime: { type: Number, required: true },
    log: { type: String, required: true },
    isCM: { type: Boolean, required: true },
});

const LowmenSchema = new mongoose.Schema({
    wingId: {type: Number, required: true},
    boss: [
        {
            bossId: { type: Number, required: true },
            solo: [killSchema],
            duo: [killSchema],
            men3: [killSchema],
            men4: [killSchema],
            men5: [killSchema]
        }
    ]
});

const Lowmen = cTDBConnection.model("Lowmen", LowmenSchema);
export default Lowmen;
