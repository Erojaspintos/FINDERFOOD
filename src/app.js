require("dotenv").config();
const Sentry = require("@sentry/node");
require("./utils/instrument");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth.router");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const loggerMiddleWare = require("./middlewares/logger.middleware");
const authMiddleWare = require("./middlewares/auth.middleware");
const sanitizerMiddleware = require("./middlewares/sanitizer.middleware");
const privateRouter = require("./routes/private.router");
const publicRouter = require("./routes/public.router");
const connectMongoDB = require("./models/schemas/mongo.client");
const logger = require("./utils/logger.js");

(async () => {
  try {
    await connectMongoDB();
    logger.info("Conexión a MongoDB establecida correctamente");
  } catch (error) {
    logger.sentryError({
      message: "Ha ocurrido un error al intentar conectarse a MongoDB: ",
      error,
    });
    process.exit(1);
  }
})();
// Middlewares
app.use(express.json());
app.use(loggerMiddleWare);
app.use(morgan("dev"));
app.use(cors());
app.use(sanitizerMiddleware);

// Public
app.use("/public", publicRouter);
app.use("/v1/auth", authRouter);

// Ruta publica para la documentacion : http://localhost:3001/documentation/#/
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // 

app.get("/sentry-test", (req, res) => {
  throw new Error("Error de prueba para Sentry");
});
app.use(authMiddleWare);
// Private
app.use("/v1", privateRouter);

Sentry.setupExpressErrorHandler(app);


module.exports = app;