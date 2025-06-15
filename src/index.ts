import express from "express";
import cors from "cors";

import { ErrorHandler } from "./middlewares/ErrorHandler";
import FullClearRouter from './Routers/FullClear/fullclear.controller';

// Init
const app = express();
const port = process.env.PORT || 4000;

// Cors white list and JSON
app.use(cors()); //TODO Only client website can access the server
app.use(express.json());

// Routers
app.use(FullClearRouter);
app.use(ErrorHandler);

app.listen(port, async () => console.log(`Server is online on Port: ${port}`));
