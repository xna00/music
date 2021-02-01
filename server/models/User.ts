// import { mongoose } from 'mo';
import mongoose, { Document } from "mongoose";
// const mongoose = require("mongoose");
import bcrypt from "bcrypt";

const schema = new mongoose.Schema<
  { username: string; password: string } & Document
>({
  username: { type: String, unique: true },
  password: {
    type: String,
    select: false,
    set(val) {
      return bcrypt.hashSync(val, 10);
    },
  },
});

export default mongoose.model("AdminUser", schema);
