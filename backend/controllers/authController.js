const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Contrôleur pour l'inscription (signup)
exports.signup = async (req, res) => {
  try {
    // Hachage du mot de passe avec un "salt" de 10
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création du nouvel utilisateur avec le mot de passe haché
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();

    // Réponse en cas de succès
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    // Gestion des erreurs
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

// Contrôleur pour la connexion (login)
exports.login = async (req, res) => {
  try {
    // Vérification si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }

    // Comparaison du mot de passe fourni avec le mot de passe haché
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }

    // Génération du token JWT si le mot de passe est correct
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Le token expirera dans 24 heures
    );

    // Réponse avec l'ID utilisateur et le token JWT
    res.status(200).json({
      userId: user._id,
      token: token,
    });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};
