import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ChevronLeft, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const bookData = await axios.get(`/api/books/${id}`);
      setBook(bookData.data);
      const reviewsData = await axios.get(`/api/reviews/${id}`);
      setReviews(reviewsData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, [id]);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsWishlisted(user.wishlist.some(item => (item._id || item) === id));
    }
  }, [user, id]);

  const toggleWishlistHandler = async () => {
    if (!user) {
      alert('Please sign in to save to your registry.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/users/wishlist/${id}`, {}, config);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error(error);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating && comment) {
      setReviewLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`/api/reviews/${id}`, { rating, comment }, config);
        setComment('');
        fetchBookData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error submitting review');
      } finally {
        setReviewLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center py-48"><div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="container mx-auto px-6 py-32 max-w-7xl">
      <Link to="/" className="text-gray-400 hover:text-secondary mb-12 inline-block text-[10px] uppercase tracking-[0.4em] font-bold transition-all flex items-center group">
        <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-24 mb-48 items-center lg:items-start">
        {/* Book Image Cover */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-5/12 relative group"
        >
          <div className="aspect-[2/3] bg-gray-50 flex items-center justify-center p-12 border border-gray-100 shadow-2xl relative overflow-hidden">
             {/* Decorative patterns */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
             
             {book.image ? (
              <motion.img 
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.5 }}
                src={book.image} 
                alt={book.title} 
                className="w-full h-full object-cover shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.3)] z-10" 
              />
            ) : (
              <div className="w-full h-full border border-gray-200 flex items-center justify-center text-gray-300 font-serif text-3xl italic tracking-widest">Golden</div>
            )}
          </div>
          {/* Subtle reflection below */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/10 blur-xl rounded-full"></div>
        </motion.div>
        
        {/* Book Info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-7/12"
        >
          <div className="mb-6 flex items-center gap-4">
             <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.4em]">{book.category}</span>
             <span className="h-[1px] w-12 bg-secondary/30"></span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 leading-[1.1] tracking-tight">{book.title}</h1>
          <h2 className="text-2xl text-gray-400 font-light mb-12 font-serif italic">by {book.author}</h2>
          
          <div className="flex items-center gap-6 mb-12 text-sm">
            <div className="flex text-secondary gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(book.rating) ? "currentColor" : "none"} stroke="currentColor" />
              ))}
            </div>
            <span className="text-gray-400 font-light italic">({book.numReviews} Verified Insights)</span>
          </div>
          
          <p className="text-gray-600 leading-[2.2] mb-16 font-light italic text-lg border-l-2 border-secondary/20 pl-10 max-w-2xl">
            {book.description || 'This rare edition awaits your discovery. A cornerstone of literary excellence and intellectual depth.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center pt-12 border-t border-gray-100">
            <div className="flex flex-col">
               <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Exquisite Value</span>
               <span className="text-4xl font-serif font-bold text-primary">₹{book.price}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:ml-auto">
               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => addToCart(book)}
                 className="btn-primary py-5 px-16 text-xs uppercase tracking-[0.3em] font-bold shadow-luxury"
               >
                 Add to Bag
               </motion.button>
               <button 
                 onClick={toggleWishlistHandler}
                 className={`flex items-center gap-2 transition-colors text-[10px] uppercase tracking-widest font-bold border border-gray-100 px-8 py-5 ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100' : 'text-gray-400 hover:text-primary'}`}
               >
                 <Heart size={14} className={isWishlisted ? 'fill-red-500' : ''} /> 
                 {isWishlisted ? 'Registry Member' : 'Save to Registry'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-10 border-t border-gray-50 opacity-60">
             <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-secondary" />
                <span className="text-[9px] uppercase font-bold tracking-widest leading-tight">Authenticity <br/> Guaranteed</span>
             </div>
             <div className="flex items-center gap-3">
                <Truck size={18} className="text-secondary" />
                <span className="text-[9px] uppercase font-bold tracking-widest leading-tight">Priority <br/> Global Dispatch</span>
             </div>
             <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-secondary" />
                <span className="text-[9px] uppercase font-bold tracking-widest leading-tight">Registry <br/> Exchange Protocol</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 pt-32 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-7">
            <h3 className="text-3xl font-serif text-primary mb-16 flex items-center gap-6">
              Critical Reception <span className="h-[1px] flex-grow bg-gray-100"></span>
            </h3>
            
            {reviews.length === 0 ? (
              <p className="text-gray-400 font-light italic text-lg opacity-60">No insights have been recorded for this edition yet.</p>
            ) : (
              <div className="space-y-12">
                {reviews.map((review, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={review._id} 
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-primary text-secondary flex items-center justify-center font-serif text-xs rounded-full">
                            {review.user?.name?.charAt(0) || 'P'}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-primary font-bold text-xs uppercase tracking-widest">{review.user?.name || 'Patron'}</span>
                            <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Verified Collector</span>
                         </div>
                      </div>
                      <div className="flex text-secondary gap-1">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-loose font-light italic text-lg pl-14 pb-8 border-b border-gray-50">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-primary p-12 shadow-2xl sticky top-40 rounded-sm"
            >
              <h3 className="text-xl font-serif text-secondary mb-10 pb-4 border-b border-white/10 tracking-tight italic">Contribute Your Insight</h3>
              
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-8">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-4">Initial Assessment</label>
                    <select 
                      className="w-full p-4 bg-white/5 border border-white/10 focus:border-secondary focus:outline-none text-white italic text-sm appearance-none transition-all"
                      value={rating} onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="5" className="bg-primary">A Masterpiece (5/5)</option>
                      <option value="4" className="bg-primary">Highly Commended (4/5)</option>
                      <option value="3" className="bg-primary">Notable Volume (3/5)</option>
                      <option value="2" className="bg-primary">Underachieving (2/5)</option>
                      <option value="1" className="bg-primary">Unfortunate Disappointment (1/5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-4">Thematic Reflection</label>
                    <textarea 
                      rows="6" 
                      required
                      className="w-full p-4 bg-white/5 border border-white/10 focus:border-secondary focus:outline-none text-gray-300 font-light placeholder-gray-700 italic text-sm transition-all"
                      value={comment} onChange={(e) => setComment(e.target.value)}
                      placeholder="Discuss the prose and profoundity..."
                    ></textarea>
                  </div>
                  <motion.button 
                    whileHover={{ backgroundColor: "#FFFFFF", color: "#000000" }}
                    type="submit" 
                    disabled={reviewLoading}
                    className="w-full bg-secondary text-primary font-bold tracking-[0.3em] uppercase py-5 text-xs transition-colors disabled:opacity-50"
                  >
                    {reviewLoading ? 'Transmitting...' : 'Authorize Submission'}
                  </motion.button>
                </form>
              ) : (
                <div className="border border-white/10 p-10 text-center">
                  <p className="text-gray-500 italic font-light text-sm mb-10 leading-relaxed">
                    Personal reflections are reserved for our registered members.
                  </p>
                  <Link to="/login" className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px] border-b border-secondary pb-1 hover:text-white transition-colors">
                    Join the Registry
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDetails;
