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
    console.log(req.query);
    const result = await sources[source].search(req.query.keyword);
    res.send(result);
  });

  router.get("/:source/:id", async (req, res) => {
    const { source, id } = req.params;
    const result = await sources[source].getDetail(id);
    res.send(result) 
  });
  app.use("/api/music", router);
};
