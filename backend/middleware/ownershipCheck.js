const Book = require("../models/Book");

module.exports = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      if (book.userId !== req.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }
      next();
    })
    .catch((error) => res.status(500).json({ error }));
};
