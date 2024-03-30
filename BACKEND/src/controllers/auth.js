"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
// Auth Controller:

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    const { username, email, password } = req.body;

    if ((username || email) && password) {
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (user && user.password == passwordEncrypt(password)) {
        if (user.is_active) {
          // JWT:
          const { password, ...accessUserData } = user.toJSON(); // user nesnesinden parolayı kaldır

          const accessToken = jwt.sign(accessUserData, process.env.ACCESS_KEY, {
            expiresIn: "1m",
          });

          const refreshToken = jwt.sign(
            { _id: user._id, password: user.password },
            process.env.REFRESH_KEY,
            { expiresIn: "2m" }
          );

          res.send({
            error: false,
            bearer: { accessToken, refreshToken },
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("This account is not active.");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong username/email or password.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username/email and password.");
    }
  },

  refresh: async (req, res) => {
    const refreshToken = req.body?.refreshToken;

    if (refreshToken) {
      //! verify ile refreshToken ve ilgili anahtarı (process.env.REFRESH_KEY) kullanarak doğrulama yapar. _id ve password değerlerinin varlığı kontrol edilir ve eğer her ikisi de mevcutsa, bu bilgilerle bir kullanıcı sorgusu yapılır. Kullanıcı sorgusu sonucunda bir kullanıcı bulunursa ve bu kullanıcının parolası doğrulanırsa, kullanıcı aktif durumda ise, yeni bir erişim tokeni oluşturulur.
      jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY,
        async function (err, userData) {
          if (err) {
            if (err.name === "TokenExpiredError") {
              // Token expired, handle gracefully
              res.status(401).json({
                error: true,
                message: "Refresh token expired. Please re-authenticate.",
              });
            } else {
              // Other errors, throw for normal handling
              throw err;
            }
          } else {
            const { _id, password } = userData;

            if (_id && password) {
              const user = await User.findOne({ _id });

              if (user && user.password == password) {
                if (user.is_active) {
                  // JWT:
                  const { password, ...accessUserData } = user.toJSON();

                  const accessToken = jwt.sign(
                    accessUserData,
                    process.env.ACCESS_KEY,
                    {
                      expiresIn: "1m",
                    }
                  );

                  res.send({
                    error: false,
                    bearer: { accessToken },
                  });
                } else {
                  res.errorStatusCode = 401;
                  throw new Error("This account is not active.");
                }
              } else {
                res.errorStatusCode = 401;
                throw new Error("Wrong id or password.");
              }
            } else {
              res.errorStatusCode = 401;
              throw new Error("Please enter id and password.");
            }
          }
        }
      );
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter token.refresh");
    }
  },

  logout: async (req, res) => {
    const auth = req.headers?.authorization || null; // Token ...tokenKey... // Bearer ...accessToken...
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

    let message = null,
      result = {};

    if (tokenKey) {
      if (tokenKey[0] == "Token") {
        // SimpleToken

        result = await Token.deleteOne({ token: tokenKey[1] });
        message = "Token deleted. Logout was OK.";
      } else {
        // JWT

        message = "No need any process for logout. You must delete JWT tokens.";
      }
    }

    res.send({
      error: false,
      message,
      result,
    });
  },
};
