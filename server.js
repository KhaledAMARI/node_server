require("dotenv").config();
require('express-async-errors');
const express = require("express");
const cors = require('cors');

const users = require("./routes/user");
const connectDB = require("./config/db");
const notFound = require('./Middlewares/not-found');
const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("<h1> Hello Khaled ! </h1>");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/users", users);
app.use(notFound);


const start = async () => {
  try {
    await connectDB(process.env.DB_PATH);
    app.listen(port, () => {
      console.log(`Server is listening on port : ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();