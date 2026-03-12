import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-32 pb-16 border-t border-secondary/10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 border-b border-white/5 pb-24 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-serif text-white hover:text-secondary flex items-center gap-3 mb-8">
            <div className="w-8 h-8 border border-secondary/30 flex items-center justify-center text-secondary text-sm font-serif">G</div>
            <span className="tracking-tight">Golden<span className="text-secondary italic">Pages</span></span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-light italic font-serif">
            "Collectors of wisdom and curators of elegance. Our collection spans the intellect of humanity."
          </p>
          <div className="flex gap-6">
            {['IG', 'TW', 'FB'].map(s => (
              <motion.a 
                whileHover={{ scale: 1.1, color: "#D4AF37" }}
                key={s} 
                href="#" 
                className="text-[10px] font-bold tracking-[0.3em] text-gray-600 transition-colors"
              >
                {s}
              </motion.a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-8 text-white tracking-tight">Curation</h4>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            <li><Link to="/search?category=Fiction" className="hover:text-secondary transition-colors">The Novels</Link></li>
            <li><Link to="/search?category=Classics" className="hover:text-secondary transition-colors">Timeless Classics</Link></li>
            <li><Link to="/search?category=Philosophy" className="hover:text-secondary transition-colors">Philosophy</Link></li>
            <li><Link to="/search?category=Arts" className="hover:text-secondary transition-colors">Visual Arts</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-8 text-white tracking-tight">The Concierge</h4>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            <li><Link to="/profile" className="hover:text-secondary transition-colors">Your Registry</Link></li>
            <li><Link to="/profile" className="hover:text-secondary transition-colors">Order Archives</Link></li>
            <li><Link to="/cart" className="hover:text-secondary transition-colors">The Bag</Link></li>
            <li><Link to="/" className="hover:text-secondary transition-colors">Inquiries</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-8 text-white tracking-tight">The Letter</h4>
          <p className="text-xs text-gray-500 mb-6 font-light italic leading-relaxed">
            Register your interest to receive insights on our newest acquisitions.
          </p>
          <div className="flex border-b border-white/10 focus-within:border-secondary transition-colors pb-3">
            <input 
              type="email" 
              placeholder="Your email correspondence..." 
              className="bg-transparent text-white w-full focus:outline-none text-xs font-light italic placeholder-gray-700"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
        <p>&copy; {new Date().getFullYear()} GoldenPages Bibliophiles.</p>
        <div className="flex gap-10 mt-6 md:mt-0">
          <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-white transition-colors">Protocol</Link>
          <Link to="/" className="hover:text-white transition-colors">Logistics</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
