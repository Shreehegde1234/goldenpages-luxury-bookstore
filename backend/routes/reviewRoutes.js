import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a review
router.post('/:bookId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.bookId);

    if (book) {
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        book: book._id,
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = new Review({
        user: req.user._id,
        book: book._id,
        rating: Number(rating),
        comment,
      });

      await review.save();

      // Recalculate book average rating
      const reviews = await Review.find({ book: book._id });
      book.numReviews = reviews.length;
      book.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await book.save();

      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


