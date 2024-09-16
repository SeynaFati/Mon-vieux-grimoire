const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Token non fourni ou format incorrect !" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    console.log("Utilisateur authentifié : ", req.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
