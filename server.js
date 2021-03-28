const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(require("./routes/api.js"));

// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });

const db = require('./config/keys').mongoURI;
console.log(db, 'this is the db')
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to mongodb succesfully"))
  .catch(err => console.log(err))



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});