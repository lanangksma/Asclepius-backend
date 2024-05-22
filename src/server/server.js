require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  try {
    // Create Hapi server instance
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
      routes: {
        cors: {
          origin: ["*"], // Allow all origins for CORS
        },
      },
    });

    // Load the ML model
    const model = await loadModel();
    server.app.model = model; // Attach model to server.app
    server.route(routes); // Set routes for the server

    // Extend server with custom error handling
    server.ext("onPreResponse", (request, h) => {
      const { response } = request;

      // Handle custom InputError
      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message: "Terjadi kesalahan dalam melakukan prediksi",
          })
          .code(400);
      }

      // Handle Payload Too Large error
      if (response.isBoom && response.output.statusCode === 413) {
        return h
          .response({
            status: "fail",
            message: "Payload content length greater than maximum allowed: 1000000",
          })
          .code(413);
      }

      // Continue with the normal response if no custom error
      return h.continue;
    });

    // Start the server
    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
})();
