import express = require("express");
module.exports = (app) => {
  const router = express.Router({
    mergeParams: true,
  });
  router.get("/suggestions", (req, res) => {
    res.send("suggestions");
  });
  router.get("/:source", (req, res) => {
    res.send({
      source: req.params.source,
    });
  });

  router.get("/:source/:id", (req, res) => {
    const { source, id } = req.params;
    res.send({
      source,
      id,
    });
  });
  app.use("/api/music", router);
};
