import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/users/profile', config);
        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const removeFromWishlist = async (bookId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`/api/users/wishlist/${bookId}`, {}, config);
      setWishlist(wishlist.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (book) => {
    addToCart({
      book: book._id,
      title: book.title,
      image: book.image,
      price: book.price,
      countInStock: book.countInStock || 10,
      qty: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <Heart className="text-secondary mb-6" size={40} strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Your Private Collection</h1>
          <p className="text-gray-500 font-light italic">"A curated list of your future acquisitions."</p>
          <div className="h-[1px] w-24 bg-secondary mt-8"></div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-luxury rounded-sm border border-gray-100">
            <p className="text-gray-400 font-light italic mb-8">Your wishlist is currently a blank page.</p>
            <Link to="/search" className="btn-primary inline-block py-3 px-10 text-xs uppercase tracking-widest font-bold">
              Discover New Volumes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlist.map((book) => (
              <motion.div
                key={book._id}
                whileHover={{ y: -10 }}
                className="bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button
                    onClick={() => removeFromWishlist(book._id)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-primary mb-2 line-clamp-1">{book.title}</h3>
                    <p className="text-secondary uppercase tracking-[0.2em] font-bold text-[10px] mb-4">
                      {book.author}
                    </p>
                    <p className="text-gray-500 font-light italic text-sm line-clamp-2 mb-6">
                      {book.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-xl font-bold text-primary font-serif">₹{book.price}</span>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:text-secondary transition-colors"
                    >
                      <ShoppingBag size={14} /> Add to Bag
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;
