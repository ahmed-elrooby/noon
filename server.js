import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";
import cors from "cors";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("ROOT:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));
console.log("DOCS EXISTS:", fs.existsSync(path.join(__dirname, "docs")));

app.use(express.json());
app.use("/", express.static("uploads/"));
app.set("query parser", "extended");

// Swagger Configuration
const swaggerServerUrl =
  (process.env.BASE_URL ? `${process.env.BASE_URL}/api/v1` : undefined) ||
  "https://noon-six.vercel.app/api/v1";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Noon API",
    version: "1.0.0",
    description: "E-commerce API Documentation",
  },
  servers: [
    {
      url: swaggerServerUrl,
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
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
      Object.assign(swaggerSpec.paths, doc.paths);
    }
    if (doc?.components) {
      Object.assign(swaggerSpec.components, doc.components);
    }
    if (doc?.tags) {
      swaggerSpec.tags.push(...doc.tags);
    }
  }
}

console.log("Swagger Paths:", Object.keys(swaggerSpec.paths || {}).length);

app.get("/api-docs", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Noon API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "BaseLayout",
        deepLinking: true,
        explorer: true,
      });
    };
  </script>
</body>
</html>`);
});

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

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
