import express = require("express");
import User from "../../models/User";
import jwt from "jsonwebtoken";
import assert = require("http-assert");
import errorHandler from "../../middleware/errorHandler";

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

  router.use(errorHandler());

  app.use("/auth", router);
};
