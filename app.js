const express = require("express");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
