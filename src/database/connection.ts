import mongoose from "mongoose";

const cTDBConnection = mongoose.createConnection(process.env.DB_KEY_NAME || "");

cTDBConnection.on("connected", () => {
  console.log("Database connection established successfully");
});

cTDBConnection.on("error", (error) => {
  console.error("Database connection error:", error);
});

export default cTDBConnection;
