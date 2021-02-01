import express = require("express");
import db from "./plugins/db";
import user from "./routes/mix";
import errorHandler from "./middleware/errorHandler";

const app = express();
app.use(express.json());

app.set("secret", "riuep9qu8r4fjwoe");

db(app);

require("./routes/music")(app);
require("./routes/auth")(app);
user(app);
app.use(errorHandler());
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
