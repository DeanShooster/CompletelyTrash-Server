import mongoose from "mongoose";

import cTDBConnection from "../connection";

const BenchmarkPlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    benchNumber: { type: Number, required: true },
    log: { type: String , required: true }
})

export type benchmarkType = 'DPS' | 'Quickness' | 'Alacrity';

const BenchmarkSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    proffessionId: { type: Number , required: true },
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
