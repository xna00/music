import mongoose, { Document } from "mongoose";

const schema = new mongoose.Schema<Document>(
  {
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    name: { type: String },
    music: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Music" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Mix", schema);
