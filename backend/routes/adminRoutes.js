import express from 'express';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import Announcement from '../models/Announcement.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get Admin Statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const booksCount = await Book.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => {
      if (order.isPaid || order.paymentStatus === 'Completed') {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);

    res.json({
      usersCount,
      booksCount,
      ordersCount,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create Announcement
router.post('/announcements', protect, admin, async (req, res) => {
  const { title, message } = req.body;
  try {
    const announcement = new Announcement({
      title,
      message,
    });
    const created = await announcement.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Active Announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;


