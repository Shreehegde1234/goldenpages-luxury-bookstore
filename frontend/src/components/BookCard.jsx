import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsWishlisted(user.wishlist.some(item => (item._id || item) === book._id));
    }
  }, [user, book._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to save to your registry.');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post(`/api/users/wishlist/${book._id}`, {}, config);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
       console.error('Wishlist error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative flex flex-col bg-white border border-gray-100 hover:border-secondary/30 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 overflow-hidden"
    >
      <Link to={`/book/${book._id}`} className="block relative overflow-hidden aspect-[2/3] bg-gray-50 flex items-center justify-center p-6">
        {book.image ? (
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7 }}
            src={book.image} 
            alt={book.title} 
            className="w-full h-full object-cover shadow-md" 
          />
        ) : (
          <div className="w-full h-full border border-gray-200 flex items-center justify-center text-gray-300 font-serif text-lg bg-gray-100 shadow-inner">Golden Pages</div>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        
        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
        >
          <Heart 
            size={16} 
            className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
          />
        </button>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow bg-white z-10">
        <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold mb-2">{book.category}</p>
        <Link to={`/book/${book._id}`}>
          <h3 className="font-serif text-xl font-bold text-primary mb-1 line-clamp-2 group-hover:text-secondary transition-colors leading-tight">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs font-light mb-4 italic">by {book.author}</p>
        
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="font-serif font-bold text-lg">₹{book.price}</span>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(book)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-secondary transition-colors border-b border-transparent hover:border-secondary pb-0.5"
          >
            Add To Bag
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
