const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");
const ownershipCheck = require("../middleware/ownershipCheck");
const upload = require("../middleware/images");

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  bookController.createBook
);
router.get("/", bookController.getBooks);
router.get("/bestrating", bookController.getBestRatedBooks);
router.get("/:id", bookController.getBookById);
router.post("/:id/rating", authMiddleware, bookController.rateBook);
router.put("/:id", authMiddleware, ownershipCheck, bookController.updateBook);
router.delete(
  "/:id",
  authMiddleware,
  ownershipCheck,
  bookController.deleteBook
);

module.exports = router;
