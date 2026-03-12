import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Book from './models/Book.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
      },
      {
        name: 'Test Member',
        email: 'user_test@gmail.com',
        password: hashedPassword,
        role: 'user',
      }
    ];

    await User.insertMany(users);

    const books = [
      {
        title: "Milk and Honey",
        author: "Rupi Kaur",
        description: "A profound collection of poetry and prose about survival, love, loss, and femininity.",
        price: 1250,
        category: "Poetry",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        numReviews: 124,
      },
      {
        title: "Pure Elegance",
        author: "Seraphina White",
        description: "A modern masterpiece on minimalistic living and the philosophy of refined aesthetics. A guide for the discerning soul in the 21st century.",
        price: 890,
        category: "Self-Development",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        numReviews: 89,
      },
      {
        title: "Whispers of the Midnight",
        author: "Julian Night",
        description: "An atmospheric collection of poetry that captures the ethereal beauty of the silent hours. Bound in premium velvet-touch hardcover.",
        price: 1500,
        category: "Fiction",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        numReviews: 56,
      },
      {
        title: "The Architectural Soul",
        author: "Marcus Aurelius II",
        description: "Tracing the evolution of design from the Renaissance to the digital age. A visual feast for the eyes and the mind.",
        price: 2400,
        category: "Arts",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
        rating: 5.0,
        numReviews: 210,
      },
      {
        title: "Midnight Musings",
        author: "Julian Night",
        description: "A sequel to the acclaimed Whispers, exploring the depths of the nocturnal mind in exquisite detail.",
        price: 1300,
        category: "Poetry",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        numReviews: 42,
      },
      {
        title: "The Opal Gate",
        author: "Lysandra Thorne",
        description: "An epic journey through high-fantasy landscapes where every word is crafted with diamond-like precision.",
        price: 1750,
        category: "Fiction",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        numReviews: 76,
      },
      {
        title: "Sovereign Spaces",
        author: "Alistair Sterling",
        description: "A definitive guide to the world's most luxurious architectural achievements and the stories behind their creation.",
        price: 2100,
        category: "Arts",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        numReviews: 31,
      },
      {
        title: "Velvet Verses",
        author: "Seraphina White",
        description: "A tactile experience of poetry, where each verse feels like velvet against the soul. Exquisitely bound for the collector.",
        price: 1450,
        category: "Poetry",
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800",
        rating: 5.0,
        numReviews: 12,
      },
      {
        title: "Gilded Journeys",
        author: "Evelyn Rose",
        description: "A travelogue of the world's most opulent destinations, written with a poet's grace and an explorer's heart.",
        price: 1950,
        category: "Non-Fiction",
        image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        numReviews: 28,
      },
      {
        title: "The Diamond Dream",
        author: "Reginald Blackwood",
        description: "A gripping thriller set in the competitive world of high-stakes diamond trading. Elegance meets intrigue.",
        price: 1600,
        category: "Fiction",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", // Reusing for luxury feel
        rating: 4.6,
        numReviews: 95,
      },
      {
        title: "Platinum Perspectives",
        author: "Dr. Elena Vance",
        description: "A collection of essays on the evolution of wealth and its social impact through the centuries.",
        price: 1800,
        category: "Self-Development",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        numReviews: 19,
      },
      {
        title: "The Silk Road Memoirs",
        author: "Marco S. Thorne",
        description: "An illustrated history of the ancient trade routes that shaped civilizations, bound in silk-touch linen.",
        price: 2200,
        category: "History",
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800",
        rating: 5.0,
        numReviews: 45,
      }
    ];

    await Book.insertMany(books);
    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
