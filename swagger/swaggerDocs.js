import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Noon Ecommerce API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "https://noon-six.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [path.join(__dirname, "./src/router/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
