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

// Accept JSON:
app.use(express.json());

// SessionsCookies:
// app.use(require("cookie-session")({ secret: process.env.SECRET_KEY }));

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

//* middlewares/authentication.js "Kimlik Kontrol"
app.use(require("./src/middlewares/authentication"));

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
