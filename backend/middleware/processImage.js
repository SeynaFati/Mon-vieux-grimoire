const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier image fourni." });
  }

  const imagePath = req.file.path;
  const optimizedImagePath = path.join(
    "images",
    `optimized_${req.file.filename}`
  );

  try {
    await sharp(imagePath).resize(800).png().toFile(optimizedImagePath);

    fs.unlinkSync(imagePath);

    req.file.optimizedPath = optimizedImagePath;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de l'optimisation de l'image." });
  }
};

module.exports = processImage;
