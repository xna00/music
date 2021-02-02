import express = require("express");
import User from "../../models/User";
import Mix from "../../models/Mix";
import jwt from "jsonwebtoken";
import assert = require("http-assert");

module.exports = (app) => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    Mix.create({ name: "喜欢的音乐", owner: newUser._id });
    res.send(newUser);
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    assert(user, 422, "用户不存在");
    const isValid = require("bcrypt").compareSync(password, user!.password);
    assert(isValid, 422, "密码错误");
    const token = jwt.sign({ id: user!._id }, app.get("secret"));
    res.send({ token });
  });

  app.use("/api/auth", router);
};
