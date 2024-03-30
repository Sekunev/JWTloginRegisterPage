"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS 
------------------------------------------------------- */
// User Controller:
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    //! kullanıcı superadmin ise hiçbir filtre uygulanmaz ve tüm kullanıcı kayıtları listelenir.
    const filters = req.user?.is_superadmin ? {} : { _id: req.user._id };

    const data = await res.getModelList(User, filters);

    res.status(200).send(data);
  },

  create: async (req, res) => {
    const data = await User.create(req.body);

    const { username, email } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] });

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

    res.status(201).send({
      error: false,
      bearer: { accessToken, refreshToken },
    });
  },

  read: async (req, res) => {
    //! kullanıcı superadmin ise filtre olarak istek parametrelerinden gelen _id değerini kullanır. Bu,süper yöneticilerin diğer kullanıcıların kayıtlarını görüntülemesi için kullanılır. Eğer kullanıcı bir  is_superadmin özelliği yoksa, filtre olarak kullanıcının kendi _id değerini kullanır. Bu, kullanıcının kendi kullanıcı kaydını görüntülemesi için kullanılır.
    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    const data = await User.findOne(filters);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    req.body.is_superadmin = req.user?.is_superadmin
      ? req.body.is_superadmin
      : false;

    //! runValidators: true seçeneği, güncelleme işlemi sırasında belirli bir belgenin doğrulama kurallarına uygun olup olmadığını kontrol etmek için kullanılır.
    const data = await User.updateOne(filters, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await User.findOne(filters),
    });
  },

  delete: async (req, res) => {
    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.deleteOne(filters);

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
