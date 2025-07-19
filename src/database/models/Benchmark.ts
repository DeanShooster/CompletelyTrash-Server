import mongoose from "mongoose";

import cTDBConnection from "../connection";

const BenchmarkPlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    benchNumber: { type: Number, required: true },
})

const BenchmarkSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    proffession: { type: String , required: true },
    type: { type: String, enum: ['DPS', 'Quickness' , 'Alacrity'], required: true },
    isPower: { type: Boolean , required: true },
    isUpToDate: { type: Boolean , default: true  },
    benchNumber: { type: Number , required: true },
    log: { type: String , required: true },
    video: { type: String , required: true },
    players: { type: [BenchmarkPlayerSchema] , required: true },
});

const Benchmark = cTDBConnection.model("Benchmark", BenchmarkSchema);
export default Benchmark;
