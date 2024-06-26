"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

// auth:
router.use("/auth", require("./auth"));
// call user.create for /register:

// user:
router.use("/users", require("./user"));
// token:
router.use("/tokens", require("./token"));

/* ------------------------------------------------------- */
module.exports = router;
