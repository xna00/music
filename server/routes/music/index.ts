import express = require("express");
import sources from "../../lib/music";
module.exports = (app) => {
  const router = express.Router({
    mergeParams: true,
  });
  router.get("/suggestions", (req, res) => {
    res.send("suggestions");
  });

  router.get("/:source", async (req, res) => {
    const { source } = req.params;
    const result = await sources[source].search(req.query.keyword);
    res.send(result);
  });

  router.post("/detail", async (req, res) => {
    const { source } = req.body;
    const music = req.body;
    const result = await sources[source].getDetail(music);
    res.send(result);
  });

  app.use("/api/music", router);
};
