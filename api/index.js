import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/auth.route.js";
dotenv.config();
import cors from "cors";

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDb is connected");
});

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/auth", UserRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statuCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(500).json({
    success: false,
    statusCode,
    message,
  });
});
