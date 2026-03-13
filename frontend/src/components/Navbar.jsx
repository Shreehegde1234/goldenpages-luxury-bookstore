import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-primary/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'}`}>
      {/* Top Thin Accent */}
      {!scrolled && (
        <div className="bg-secondary/10 border-b border-secondary/10 text-[8px] md:text-[10px] text-secondary font-bold text-center py-1.5 md:py-2 tracking-[0.2em] md:tracking-[0.4em] uppercase absolute -top-8 md:-top-10 w-full animate-pulse transition-opacity duration-500">
           Exclusive: Free Global Dispatch for Elite Members
        </div>
      )}
      
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative gap-4 md:gap-8">
        {/* Brand */}
        <Link to="/" className="text-xl md:text-3xl font-serif text-white hover:text-secondary flex items-center gap-2 md:gap-4 group transition-all">
          <motion.div 
            whileHover={{ rotate: 90 }}
            className="w-8 h-8 md:w-10 md:h-10 border border-secondary/30 flex items-center justify-center text-secondary text-base md:text-xl font-serif group-hover:border-secondary transition-colors"
          >
            G
          </motion.div>
          <span className="inline-block tracking-tight text-lg md:text-2xl">Golden<span className="text-secondary italic">Pages</span></span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md relative group">
          <form onSubmit={submitHandler} className="w-full">
            <input
              type="text"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Inquire for a specific volume..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all font-sans text-xs italic tracking-widest shadow-inner"
            />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-secondary transition-colors" />
          </form>
        </div>

        {/* Main Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-sans text-[10px] tracking-[0.3em] uppercase font-bold text-gray-300">
          <Link to="/" className="hover:text-secondary transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-500"></span>
          </Link>
          <Link to="/course" className="hover:text-secondary transition-colors relative group">
            Course
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-500"></span>
          </Link>
          <Link to="/about" className="hover:text-secondary transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-500"></span>
          </Link>
          <Link to="/contact" className="hover:text-secondary transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-500"></span>
          </Link>

          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            <Link to="/cart" className="relative hover:text-secondary group transition-colors flex flex-col items-center">
              <ShoppingCart size={18} className="mb-0.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-secondary text-primary rounded-full h-3.5 w-3.5 flex items-center justify-center text-[8px] font-bold shadow-lg">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/wishlist" className="hover:text-secondary transition-colors flex flex-col items-center" title="Wishlist">
                  <Heart size={18} className="mb-0.5" />
                </Link>
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="hover:text-secondary transition-colors flex flex-col items-center">
                  <User size={18} className="mb-0.5" />
                </Link>
                <button onClick={handleLogout} className="hover:text-secondary transition-colors" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-secondary transition-colors uppercase font-bold text-[10px] tracking-[0.2em] border border-secondary/40 px-6 py-2 rounded-sm hover:bg-secondary hover:text-primary">
                Login/Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white hover:text-secondary transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-xs uppercase tracking-[0.2em] font-bold text-gray-300">
               <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
               <Link to="/course" onClick={() => setMobileMenuOpen(false)}>Course</Link>
               <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
               <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
               <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Shopping Bag ({cartItems.length})</Link>
               <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
               <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
               {user ? (
                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-secondary">Exit Sanctuary</button>
               ) : (
                 <Link to="/login" className="text-secondary" onClick={() => setMobileMenuOpen(false)}>Login/Sign in</Link>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacing for content since navbar is fixed */}
      {scrolled && <div className="h-0 md:h-2" />}
    </nav>
  );
};

export default Navbar;
