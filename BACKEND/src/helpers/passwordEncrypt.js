"use strict";
/* -------------------------------------------------------
    EXPRESS 
------------------------------------------------------- */
//! Bu işlev, verilen parolayı, belirtilen anahtar, iterasyon sayısı, şifreleme algoritması ve uzunlukta bir anahtar üretmek için pbkdf2Sync fonksiyonunu kullanır. Üretilen anahtar hexadecimal biçimde dönüştürülerek (toString('hex')), güvenli bir şekilde saklanabilir veya gönderilebilir.
// passwordEncrypt():
// password: Şifrelenmesi gereken parola.
// keyCode: Anahtar olarak kullanılacak gizli anahtar veya kod.
// loopCount: Iterasyon sayısı. Bu, PBKDF2 algoritmasının ne kadar süre çalışacağını belirler. Daha yüksek bir değer, daha güvenli ancak daha yavaş bir işlem sağlar.
// charCount: Üretilen anahtarın uzunluğu (byte cinsinden).
// encType: Kullanılacak şifreleme algoritması.

const crypto = require("node:crypto"),
  keyCode = process.env.SECRET_KEY,
  loopCount = 10_000,
  charCount = 32,
  encType = "sha512";

module.exports = function (password) {
  return crypto
    .pbkdf2Sync(password, keyCode, loopCount, charCount, encType)
    .toString("hex");
};
