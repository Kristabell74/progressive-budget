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



// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });

const db = require('./config/keys').mongoURI;
console.log(db, 'this is the db')
console.log(db)
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to mongodb succesfully"))
  .catch(err => console.log(err))


app.use(express.static("public"));
app.use(require("./routes/api.js"));



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});