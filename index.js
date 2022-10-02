import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import multer from "multer";
import UserRoutes from "./src/users/routes.js";
import DoctorRoutes from "./src/doctors/routes.js";
import PatientRoutes from "./src/patients/routes.js";
import TestRoutes from "./src/tests/routes.js";

import pool from "./db.js";


dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8000;

// const corsOption = {creditials: true, origin: process.env.URL || '*'};

// app.use(cors(corsOptions));
app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/images", express.static(join(__dirname, "images")));
app.use("/api/v1/", UserRoutes);
app.use("/api/v1/", DoctorRoutes);
app.use("/api/v1/", PatientRoutes);
app.use("/api/v1/", TestRoutes);

app.use("/", (req, res) => {
  res.send("NOT FOUND");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next({
    message: "Not Found",
    status: 404,
  });
});

app.listen(PORT, () => console.log("server listnening on " + PORT));
