"use strict";
/* -------------------------------------------------------
    EXPRESS 
------------------------------------------------------- */
// app.use(errorHandler):

//! uygulama içinde bir hata oluştuğunda, bu hata işleyicisi devreye girer ve istemciye uygun bir hata yanıtı gönderir.

module.exports = (err, req, res, next) => {
  return res.status(res?.errorStatusCode || 500).send({
    error: true,
    message: err.message,
    cause: err.cause,
    body: req.body,
  });
};
