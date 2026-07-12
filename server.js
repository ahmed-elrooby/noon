import express from "express";
import dotenv from "dotenv";
import DbConnect from "./databases/dbConnect.js";
import { init } from "./src/index.routes.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const port = process.env.PORT || 3000;

const app = express();

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

  apis: [`${process.cwd()}/docs/*.yaml`],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("Swagger Paths:", Object.keys(swaggerSpec.paths || {}));
app.get("/test-swagger", (req, res) => {
  res.json({
    status: "ok",
    paths: Object.keys(swaggerSpec.paths || {}),
  });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

init(app);

await DbConnect();

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

process.on("unhandledRejection", (err) => console.log(err));

export default app;
