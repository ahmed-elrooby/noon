import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
const port = process.env.PORT || 3000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("ROOT:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));
console.log("DOCS EXISTS:", fs.existsSync(path.join(__dirname, "docs")));
dotenv.config();

app.use(express.json());
app.use("/", express.static("uploads/"));
app.set("query parser", "extended");

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Noon API",
      version: "1.0.0",
      description: "E-commerce API Documentation",
    },

    servers: [
      {
        url: "https://noon-coral.vercel.app/api/v1",
      },
    ],
  },

  apis: [path.join(__dirname, "docs", "*.yaml")],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Swagger Paths:", Object.keys(swaggerSpec.paths || {}));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  }),
);
init(app);

await DbConnect();

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

process.on("unhandledRejection", (err) => console.log(err));

export default app;
