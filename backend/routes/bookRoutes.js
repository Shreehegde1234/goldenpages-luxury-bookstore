import express from 'express';
import Book from '../models/Book.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all books with search and filter
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const books = await Book.find({ ...keyword, ...category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create Book
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, author, description, price, category, image } = req.body;
    const book = new Book({ title, author, description, price, category, image });
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
