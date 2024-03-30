"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "username": "admin",
    "password": "aA*123456",
    "email": "admin@site.com",
    "is_active": true,
    "is_staff": true,
    "is_superadmin": true
}

/* ------------------------------------------------------- */
// User Model:

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      //! index yapılan sorguların daha hızlı çalışmasını sağlar.
    },

    password: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_staff: {
      type: Boolean,
      default: false,
    },

    is_superadmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

/* ------------------------------------------------------- */
// Schema Configs:

const passwordEncrypt = require("../helpers/passwordEncrypt");

//! Aşağıdaki kod Mongoose şemasında bir ön işlem (pre hook) tanımlar. Bu ön işlem, "save" veya "updateOne" işlemleri gerçekleştirilmeden önce çalışır.
//! Email doğrulaması yapar
//! Parola doğrulaması yapar
//! hata olmadığı durumda işlemi devam ettirir ve "next()" fonksiyonunu çağırarak kaydetmeye (save) veya güncellemeye (updateOne) izin verir.

UserSchema.pre(["save", "updateOne"], function (next) {
  // get data from "this" when create;
  // if process is updateOne, data will receive in "this._update"
  const data = this?._update || this;

  // email@domain.com
  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) // test from "data".
    : true;

  if (isEmailValidated) {
    if (data?.password) {
      // pass == (min 1: lowerCase, upperCase, Numeric, @$!%*?& + min 8 chars)
      const isPasswordValidated =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
          data.password
        );

      if (isPasswordValidated) {
        this.password = data.password = passwordEncrypt(data.password);
        this._update = data; // updateOne will wait data from "this._update".
      } else {
        next(new Error("Password not validated."));
      }
    }

    next(); // Allow to save.
  } else {
    next(new Error("Email not validated."));
  }
});

module.exports = mongoose.model("User", UserSchema);
