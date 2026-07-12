import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("ROOT:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));
console.log("DOCS EXISTS:", fs.existsSync(path.join(__dirname, "docs")));

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
        url:
          (process.env.BASE_URL
            ? `${process.env.BASE_URL}/api/v1`
            : undefined) || "http://localhost:3000/api/v1",
      },
    ],
  },

  apis: [path.join(__dirname, "docs", "*.yaml")],
};

let swaggerSpec = swaggerJsdoc(swaggerOptions);
if (
  !swaggerSpec ||
  typeof swaggerSpec !== "object" ||
  !swaggerSpec.paths ||
  Object.keys(swaggerSpec.paths).length === 0
) {
  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "Noon API",
      version: "1.0.0",
      description: "E-commerce API Documentation",
    },
    servers: [
      {
        url:
          (process.env.BASE_URL
            ? `${process.env.BASE_URL}/api/v1`
            : undefined) || "http://localhost:3000/api/v1",
      },
    ],
    paths: {},
    components: {},
    tags: [],
  };

  const docsDir = path.join(__dirname, "docs");
  if (fs.existsSync(docsDir)) {
    const yamlFiles = fs
      .readdirSync(docsDir)
      .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));

    for (const yamlFile of yamlFiles) {
      const doc = YAML.load(path.join(docsDir, yamlFile));
      if (doc?.paths) {
        swaggerDoc.paths = { ...swaggerDoc.paths, ...doc.paths };
      }
      if (doc?.components) {
        swaggerDoc.components = {
          ...swaggerDoc.components,
          ...doc.components,
        };
      }
      if (doc?.tags) {
        swaggerDoc.tags = [...swaggerDoc.tags, ...doc.tags];
      }
    }
  }

  swaggerSpec = swaggerDoc;
}

console.log("Swagger Paths:", Object.keys(swaggerSpec.paths || {}).length);

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
