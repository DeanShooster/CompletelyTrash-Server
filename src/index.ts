import express from "express";
import cors from "cors";

import { ErrorHandler } from "./middlewares/ErrorHandler";
import AdminRouter from './Routers/Admin/admin.controller';
import GeneralRouter from './Routers/General/general.controller';
import LowmenRouter from './Routers/Lowmen/lowmen.controller';
import FullClearRouter from './Routers/FullClear/fullclear.controller';
import BenchmarkRouter from './Routers/Benchmark/benchmark.controller';
import RecruitmentRouter from './Routers/Recruitment/recruitment.controller';
import { initDiscordBot } from "./discord";

// Init
const app = express();
const port = process.env.PORT || 4000;

// Cors white list and JSON
app.use(cors());
app.use(express.json());

// Routers
app.use(AdminRouter);
app.use(GeneralRouter);
app.use(LowmenRouter);
app.use(FullClearRouter);
app.use(BenchmarkRouter);
app.use(RecruitmentRouter);
app.use(ErrorHandler);

initDiscordBot();

app.listen(port, async () => console.log(`Server is online on Port: ${port}`));
