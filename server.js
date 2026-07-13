import express from "express";
import dotenv from "dotenv";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";
import cors from "cors";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/", express.static("uploads/"));
app.set("query parser", "extended");

init(app);

try {
  await DbConnect();
} catch (err) {
  console.error("DB Connection Error:", err);
}

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

process.on("unhandledRejection", (err) => console.log(err));

export default app;
