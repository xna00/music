import express = require("express");
import User from "../../models/User";
import jwt from "jsonwebtoken";

module.exports = (app) => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({ username });
    if (user.length) {
      res.send({ message: "用户名已存在" });
    } else {
      const newUser = await User.create({ username, password });
      res.send(newUser);
    }
  });

  router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    res.send(user);
  });

  app.use("/auth", router);
};
