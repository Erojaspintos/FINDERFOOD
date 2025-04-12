require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth.router");

const loggerMiddleWare = require("./middlewares/logger.middleware");
const authMiddleWare = require("./middlewares/auth.middleware");
const sanitizerMiddleware = require("./middlewares/sanitizer.middleware");
const privateRouter = require("./routes/private.router");
const publicRouter = require("./routes/public.router");
const connectMongoDB = require("./models/schemas/mongo.client");

(async () => {
  try {
    await connectMongoDB();
  } catch (error) {
    console.log("Ha ocurrido un erro al intentar conectarse a MONGODB: ", error);
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

app.use(authMiddleWare);
// Private
app.use("/v1", privateRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listen & serve PORT: ${PORT}! PROBANDING`);
});



