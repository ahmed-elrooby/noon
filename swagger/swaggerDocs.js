import swaggerJsdoc from "swagger-jsdoc";

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

  apis: ["./src/router/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
