import assert from "http-assert";
import express from "express";
import authMiddleware from "../../middleware/auth";
import errorHandler from "../../middleware/errorHandler";
import Mix from "../../models/Mix";
import sources from "../../lib/sources";

export default (app) => {
  const router = express.Router();

  router.get("/", async (req: any, res) => {
    const mixes = await Mix.aggregate([
      { $match: { owner: req.user._id } },
      { $addFields: { firstMusicId: { $arrayElemAt: ["$music", 0] } } },
      {
        $lookup: {
          from: "musics",
          foreignField: "_id",
          localField: "firstMusicId",
          as: "firstMusic",
        },
      },
      { $addFields: { cover: "$firstMusic.imageUrl" } },
      { $unset: ["firstMusicId", "firstMusic"] },
    ]);
    res.send(mixes);
  });

  router.post("/", async (req: any, res) => {
    const { name } = req.body;
    assert(name, 400, "无效名字");
    const mix = await Mix.create({ name, owner: req.user._id });
    res.send(mix);
  });

  router.get("/:id", async (req, res) => {
    const mix = await Mix.findById(req.params.id).populate("music");
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

  router.post("/import", async (req: any, res) => {
    console.log("import");
    console.log(req.body.url);
    const rawMix = await sources.importMix(req.body.url);
    console.log(rawMix);
    if (!rawMix) {
      res.send({ success: false });
      return;
    }
    console.log(rawMix);
    const mix = await Mix.create({
      name: rawMix.name,
      owner: req.user._id,
      music: rawMix.music,
    });
    res.send(mix);
  });

  router.use(errorHandler());
  app.use("/api/mixes", authMiddleware(), router);
};
