import mongoose from "mongoose";

import cTDBConnection from "../connection";

const GeneralSchema = new mongoose.Schema({
    patches: [{ type: String }],
    players: [{name: { type: String}, accountName: { type: String } }],
    bossNames: [[{type: String}]]
});

const General = cTDBConnection.model("General", GeneralSchema);
export default General;