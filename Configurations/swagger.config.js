const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path")
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spext Project API",
      version: "0.1.0",
      description:"Media sharing platform.",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: [path.resolve(__dirname, "../Routes/Files.js")],
};

const spec = swaggerJsDoc(options);
module.exports = spec