import express from "express";
import dotenv from "dotenv";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();

app.use(express.json());
app.use("/", express.static("uploads/"));
app.set("query parser", "extended");

init(app);

await DbConnect();

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

process.on("unhandledRejection", (err) => console.log(err));

export default app;
