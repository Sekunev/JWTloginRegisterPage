"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/auth:

const auth = require("../controllers/auth");

// URL: /auth

router.post("/register", auth.register); // SimpleToken & JWT
router.post("/login", auth.login); // SimpleToken & JWT
router.post("/refresh", auth.refresh); // JWT Refresh
router.get("/logout", auth.logout); // SimpleToken Logout
router.post("/logout", auth.logout); // SimpleToken Logout

/* ------------------------------------------------------- */
module.exports = router;
