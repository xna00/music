import express = require("express");
import db from "./plugins/db";
import user from "./routes/mix";
import errorHandler from "./middleware/errorHandler";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
let webDir = __dirname + "/../web/";
if (!fs.existsSync(webDir)) {
  webDir = __dirname + "/../../web/";
}
app.use("/", express.static(webDir + "dist_mobile"));

app.set("secret", "riuep9qu8r4fjwoe");

db(app);

require("./routes/music")(app);
require("./routes/auth")(app);
user(app);
app.use(errorHandler());
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
