import { AppError } from "../helpers/exeptions.js";

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(origin =>
  origin.trim()
);

const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.includes(origin) || !origin
      ? callback(null, true)
      : callback(new AppError("Not allowed by CORS").message);
  },
  credentials: true,
  SameSite: "None", // since frontend is on a different domain use "None"
  secure: process.env.NODE_ENV === "prod",
};

export default corsOptions;
