import { MusicDetail } from "./../lib/music/index";
import mongoose, { Document } from "mongoose";

const schema = new mongoose.Schema<MusicDetail & Document>({
  id: { type: String },
  source: { type: String },
  name: { type: String },
  artists: [{ type: String }],
  album: { type: String },
  audioUrl: { type: String },
  imageUrl: { type: String },
  lyric: { type: String },
});

export default mongoose.model("Music", schema);
