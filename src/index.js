const express = require("express");
const app = express();
const route = require("./routes/routes");
const cors = require("cors");
const sequelize=require("../public/config/db")
app.use(express.json());
app.use("/api", route);
app.use(cors());
app.use("/", (err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

sequelize.sync({ force: false }) // Will only create tables if they don't exist
  .then(() => {
    console.log("Connected to MySQL");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(err => console.log('Error syncing database: ', err));


