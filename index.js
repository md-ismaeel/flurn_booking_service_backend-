import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./Routes/userRoutes.js";

const corsOptions = {
  origin: [
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const PORT = 10000;
const mongodbUri = process.env.MONGODB_URI
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(`${mongodbUri}/booking-Service`)
  .then(() => console.log("mongodbUri connection stablish successfully!!"))
  .catch((err) => console.log("Error while connecting database", err));

app.use("/api/v1/user", userRouter)


app.use("/*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "path not found",
  });
});

app.listen(PORT, () => console.log(`Server up and running on ${PORT} port`));
