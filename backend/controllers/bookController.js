const Book = require("../models/Book");

exports.createBook = async (req, res) => {
  try {
    const book = JSON.parse(req.body.book);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    const newBook = new Book({
      ...book,
      userId: req.userId,
      imageUrl: imageUrl,
    });

    await newBook.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé !" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.rateBook = (req, res) => {
  const { userId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ error: "La note doit être comprise entre 0 et 5." });
  }

  if (!req.userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const bookId = req.params.id;
  if (!bookId) {
    return res
      .status(400)
      .json({ error: "L'identifiant du livre est manquant." });
  }

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      const userHasRated = book.ratings.some(
        (rating) => rating.userId === req.userId
      );
      if (userHasRated) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }

      const newRating = { userId: req.userId, grade: rating };
      book.ratings.push(newRating);

      const grades = book.ratings.map((r) => r.grade);
      const averageRating =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length;

      book.averageRating = averageRating;

      book
        .save()
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch((error) =>
          res
            .status(500)
            .json({ error: "Erreur lors de la mise à jour du livre." })
        );
    })
    .catch((error) => res.status(500).json({ error: "Erreur serveur." }));
};

exports.getBestRatedBooks = (req, res) => {
  console.log("Requête reçue pour obtenir les meilleurs livres");
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des meilleurs livres:",
        error
      );
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des meilleurs livres",
        error,
      });
    });
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({ message: "Livre mis à jour !", book: updatedBook });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour du livre", error });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({ message: "Livre supprimé !" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la suppression du livre", error });
  }
};
