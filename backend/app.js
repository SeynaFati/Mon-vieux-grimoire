const express = require("express");
const mongoose = require("mongoose");
const booksRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/authRoutes");
const path = require("path");
require("dotenv").config();

// Connexion à la base de données
mongoose
  .connect(
    `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@${process.env.DB_URL}`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création de l'application
const app = express();
// Middleware permettant à Express d'extraire le corps JSON des requêtes POST
app.use(express.json());

// Middleware gérant les erreurs de CORS
app.use((req, res, next) => {
  // Accès à notre API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Autorisation d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Gestion de la ressource images de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// Enregistrement des routeurs
app.use("/api/auth", userRoutes);
app.use("/api/books", booksRoutes);

module.exports = app;
