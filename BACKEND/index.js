"use strict";
/* -------------------------------------------------------
    EXPRESS 
------------------------------------------------------- */

const express = require("express");
const app = express();

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// Logging:
// npm i morgan
// https://expressjs.com/en/resources/middleware/morgan.html
const morgan = require("morgan");
// console.log(morgan);
app.use(morgan("combined"));

//? Write logs to file - day by day:
const fs = require("fs");
const now = new Date();
const today = now.toISOString().split("T")[0];
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(`./logs/${today}.log`, { flags: "a" }),
  })
);
// Accept JSON:
app.use(express.json());

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

//* middlewares/authentication.js "Kimlik Kontrol"
app.use(require("./src/middlewares/authentication"));

// Swagger-UI Middleware:
// npm i swagger-ui-express
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
// Parse/Run swagger.json and publish on any URL:
app.use(
  "/docs/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson, {
    swaggerOptions: { persistAuthorization: true },
  })
);

/* ------------------------------------------------------- */

app.use(
  require("cors")({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:4173",
      "http://localhost:5173",
    ],
  })
);
/* ------------------------------------------------------- */
// Routes:

app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to User API",
    user: req.user,
  });
});

// Routes:
app.use(require("./src/routes"));

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/* ------------------------------------------------------- */
