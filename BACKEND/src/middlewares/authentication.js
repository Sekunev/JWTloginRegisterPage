"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
// app.use(authentication):

const jwt = require("jsonwebtoken");
const Token = require("../models/token");

//! gelen isteklerin kimlik doğrulamasını yapmak ve kullanıcı verilerine erişimi kolaylaştırmak için kullanılır.

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null; // Token ...tokenKey... // Bearer ...accessToken...
  const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

  if (tokenKey) {
    if (tokenKey[0] == "Token") {
      // SimpleToken

      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
        "user_id"
      );
      req.user = tokenData ? tokenData.user_id : undefined;
    } else if (tokenKey[0] == "Bearer") {
      // JWT

      jwt.verify(
        tokenKey[1], // Doğrulanacak JWT tokeni
        process.env.ACCESS_KEY, // Tokeni doğrulamak için kullanılacak anahtar
        (err, userData) => (req.user = userData) // Doğrulama işlemi tamamlandığında çalışacak callback fonksiyonu; userData, tokenin içeriğini temsil eder
      );
    }
  }

  next();
};
