import express = require("express");
import assert = require("http-assert");
import proxy from "../../lib/proxy";

export default (app) => {
  const router = express.Router();

  router.get("/:category/:encoded_url", async (req, res) => {
    proxy(req, res);
  });

  app.use("/api/proxy", router);
};
