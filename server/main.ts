import express = require("express");
import db from "./plugins/db";

const app = express();
app.use(express.json());

app.set("secret", "riuep9qu8r4fjwoe");

db(app);

require("./routes/music")(app);
require("./routes/auth")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
