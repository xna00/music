import assert from "http-assert";
import express from "express";
import authMiddleware from "../../middleware/auth";
import errorHandler from "../../middleware/errorHandler";
import Mix from "../../models/Mix";

export default (app) => {
  const router = express.Router();

  router.get("/", async (req: any, res) => {
    const mixes = await Mix.find({
      owner: req.user._id,
    });
    res.send(mixes);
  });

  router.post("/", async (req: any, res) => {
    const { name } = req.body;
    assert(name, 400, "无效名字");
    const mix = await Mix.create({ name, owner: req.user._id });
    res.send(mix);
  });

  router.get("/:id", async (req, res) => {
    const mix = await Mix.findById(req.params.id).populate("Music");
    res.send(mix);
  });

  router.put("/:id", async (req, res) => {
    const mix = await Mix.findByIdAndUpdate(req.params.id, req.body);
    res.send(mix);
  });

  router.delete("/:id", async (req, res) => {
    const mix = await Mix.findById(req.params.id);
    mix?.remove();
    res.send({ succeed: true });
  });

  router.use(errorHandler());
  app.use("/mixes", authMiddleware(), router);
};
