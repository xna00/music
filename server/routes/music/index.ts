import express = require("express");
import sources from "../../lib/sources";
module.exports = (app) => {
  const router = express.Router({
    mergeParams: true,
  });

  router.get("/sources", (req, res) => {
    res.send(sources.getSources());
  });

  router.get("/suggestions", (req, res) => {
    res.send("suggestions");
  });

  router.get("/:source", async (req, res) => {
    const { source } = req.params;
    const result = await sources.search(source, req.query.keyword as string);
    res.send(result);
  });

  router.post("/detail", async (req, res) => {
    const music = req.body;
    const result = await sources.getDetail(music);
    res.send(result);
  });

  router.patch("/update", async (req, res) => {
    const music = await sources.update(req.body);
    res.send(music);
  });

  app.use("/api/music", router);
};
