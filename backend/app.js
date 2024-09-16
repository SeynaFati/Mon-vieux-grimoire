const express = require("express");
const mongoose = require("mongoose");
const booksRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/authRoutes");
const path = require("path");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@${process.env.DB_URL}`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/books", booksRoutes);

module.exports = app;
