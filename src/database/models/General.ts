import mongoose from "mongoose";

import cTDBConnection from "../connection";

const GeneralSchema = new mongoose.Schema({
    patches: [{ type: String }],
    players: [{type: String}]
});

const General = cTDBConnection.model("General", GeneralSchema);
export default General;