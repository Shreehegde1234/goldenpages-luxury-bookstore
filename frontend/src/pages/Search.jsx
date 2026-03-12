import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BookCard from '../components/BookCard';

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, searchHistory, fetchSearchHistory } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let url = '/api/books?';
        if (keyword) url += `keyword=${keyword}&`;
        if (category) url += `category=${category}&`;
        
        const { data } = await axios.get(url);
        setBooks(data);
        
        if (user && keyword) {
          try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/users/search-history', { keyword }, config);
            fetchSearchHistory();
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [keyword, category, user]);

  return (
    <div className="container mx-auto px-6 py-32 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-20">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 border border-gray-100 shadow-sm sticky top-32 rounded-sm"
          >
            <h2 className="text-xl font-serif text-primary mb-8 pb-3 border-b border-secondary/20 tracking-tight">Refine Catalogue</h2>
            
            <div className="mb-12">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 font-sans">Classifications</h3>
              <ul className="space-y-4 font-light text-primary/80 italic">
                {['Fiction', 'Non-Fiction', 'Classics', 'Self-Development', 'Programming'].map(c => (
                  <li key={c}>
                    <button 
                      onClick={() => navigate(`/search?category=${c}`)}
                      className={`hover:text-secondary transition-colors text-sm ${category === c ? 'text-secondary font-bold underline decoration-secondary/30 underline-offset-8' : ''}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
                <li>
                   <button onClick={() => navigate('/search')} className="hover:text-secondary mt-10 text-[10px] uppercase tracking-widest font-bold border-b border-gray-300 pb-1">Reset</button>
                </li>
              </ul>
            </div>

            {user && searchHistory.length > 0 && (
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 font-sans">Previous Inquiries</h3>
                <div className="flex flex-wrap gap-3">
                  {searchHistory.map((term, i) => (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      key={i}
                      onClick={() => navigate(`/search?keyword=${term}`)}
                      className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-sm text-[10px] hover:border-secondary hover:text-primary transition-all font-bold tracking-widest"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Search Results */}
        <div className="w-full md:w-3/4">
          <div className="mb-16 flex flex-col md:flex-row justify-between md:items-end border-b border-gray-100 pb-10 gap-6">
            <div>
              <p className="text-secondary tracking-[0.4em] uppercase font-bold text-[10px] mb-4">Search Results</p>
              <h1 className="text-4xl md:text-5xl font-serif text-primary tracking-tight">
                {keyword ? `The "${keyword}" Inquiry` : category ? `The ${category} Selection` : 'The Permanent Collection'}
              </h1>
            </div>
            <p className="text-gray-400 italic font-light text-sm">{books.length} curated volumes discovered</p>
          </div>

          {loading ? (
             <div className="flex justify-center py-24"><div className="w-12 h-12 border-4 border-gray-50 border-t-secondary rounded-full animate-spin"></div></div>
          ) : books.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-32 text-gray-400 font-light italic text-xl border border-dashed border-gray-200"
            >
              "We could not locate any manuscripts matching your elite criteria."
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {books.map((book, index) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
