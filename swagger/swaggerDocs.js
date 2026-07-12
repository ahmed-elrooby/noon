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
        description: "Production Server",
      },
    ],
  },

  apis: ["./src/router/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
