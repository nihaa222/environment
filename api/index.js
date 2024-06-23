import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import initiativeRoutes from "./routes/initiative.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
import cors from "cors";

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDb is connected");
});

const __dirname = path.resolve();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/initiative", initiativeRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statuCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(500).json({
    success: false,
    statusCode,
    message,
  });
});
