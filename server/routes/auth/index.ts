import express = require("express");
import User from "../../models/User";
import jwt from "jsonwebtoken";
import assert = require("http-assert");

module.exports = (app) => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.send(newUser);
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    assert(user, 422, "用户不存在");
    // 2.校验密码
    const isValid = require("bcrypt").compareSync(password, user!.password);
    assert(isValid, 422, "密码错误");
    // // 3.返回token
    const token = jwt.sign({ id: user!._id }, app.get("secret"));
    res.send({ token });
  });

  router.use((err, req, res, next) => {
    if (err.message.includes("E11000")) {
      err.statusCode = 422;
      err.message = "用户名已存在";
    }
    res.status(err.statusCode || 500).send({
      message: err.message,
    });
  });

  app.use("/auth", router);
};
