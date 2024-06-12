const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "https://atlas-books-back.vercel.app",
      "http://localhost:5173",
      "https://atlasbooks.netlify.app",
    ];

const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.includes(origin) || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS").message);
  },
  credentials: true,
};

export default corsOptions;
