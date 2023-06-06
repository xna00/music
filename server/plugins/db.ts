export default (app) => {
  const mongoose = require("mongoose");
  mongoose.set("useCreateIndex", true);
  mongoose.connect("mongodb+srv://xna:141478994xna@cluster0.d5zfkp7.mongodb.net/music?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  require("require-all")(__dirname + "/../models");
};
