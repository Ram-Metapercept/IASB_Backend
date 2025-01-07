const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./routes/routes");
const cors = require("cors");
app.use(express.json());
app.use("/api", route);
app.use(cors());
app.use("/", (err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
mongoose
  .connect(
    "mongodb+srv://kailashm:drWNcxBUIDpR1HoK@cluster0.3jpbiti.mongodb.net/abc?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(function () {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(function (err) {
    console.log("Error connecting to MongoDB", err);
  });
