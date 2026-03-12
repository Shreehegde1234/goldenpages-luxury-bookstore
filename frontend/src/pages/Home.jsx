import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../components/BookCard';
import heroBg from '../assets/hero_bg.png';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('/api/books');
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get('/api/admin/announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    fetchBooks();
    fetchAnnouncements();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={heroBg} alt="Library" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary/90 z-1"></div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-secondary uppercase tracking-[0.4em] font-bold text-xs mb-8"
          >
            Since MCMXCVIII &bull; The Art of Reading
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] text-white"
          >
            Curators of the <br/> 
            <span className="text-gold-gradient italic font-normal">Exquisite Word</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl font-light text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed italic"
          >
            "A library is not a luxury but one of the necessities of life."
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link to="/search" className="btn-primary inline-block text-sm py-4 px-12 uppercase tracking-[0.2em] font-bold shadow-2xl">
              Explore Collection
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-secondary to-transparent"></div>
        </motion.div>
      </section>

      {/* Announcements Bar */}
      <AnimatePresence>
        {announcements.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-secondary text-primary py-3 px-6 overflow-hidden"
          >
            <div className="container mx-auto flex items-center justify-center gap-6 overflow-hidden">
               <div className="flex animate-marquee whitespace-nowrap gap-12 text-[10px] font-bold uppercase tracking-[0.3em]">
                  {announcements.map((ann, i) => (
                    <span key={ann._id || i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {ann.message}
                    </span>
                  ))}
                  {/* Duplicate for smooth marquee if few items */}
                  {announcements.length < 5 && announcements.map((ann, i) => (
                    <span key={`dup-${i}`} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {ann.message}
                    </span>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Featured Collection Strip */}
      <div className="bg-secondary/10 border-y border-secondary/20 py-10">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
           <span className="font-serif text-xl md:text-2xl text-primary tracking-widest">OBSERVER</span>
           <span className="font-serif text-xl md:text-2xl text-primary tracking-widest uppercase">The Times</span>
           <span className="font-serif text-xl md:text-2xl text-primary tracking-widest uppercase italic">Vogue</span>
           <span className="font-serif text-xl md:text-2xl text-primary tracking-widest uppercase">Guardian</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-32">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-[1px] bg-secondary mb-8"
          ></motion.div>
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">New Acquisitions</h2>
          <p className="text-gray-500 max-w-xl font-light italic leading-relaxed">
            Recently discovered and meticulously verified for our permanent collection.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {books.slice(0, 8).map((book, index) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
        
        {/* Editorial Section */}
        <section className="mt-48 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="relative"
           >
              <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden shadow-2xl">
                 <img src={heroBg} className="w-full h-full object-cover grayscale brightness-50" alt="Detail" />
                 <div className="absolute inset-0 flex items-center justify-center p-12">
                     <div className="border border-secondary/30 p-10 text-white text-center">
                        <h3 className="text-3xl font-serif mb-4">The Librarian's Choice</h3>
                        <p className="font-light italic text-sm">"A masterpiece is a conversation between centuries."</p>
                     </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-64 bg-secondary shadow-2xl hidden md:block">
                 <div className="h-full w-full border border-white/20 p-6 flex flex-col justify-end">
                    <span className="text-primary font-bold text-4xl font-serif">84%</span>
                    <span className="text-primary/70 text-[10px] uppercase font-bold tracking-widest mt-2">Rare Finds Retained</span>
                 </div>
              </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
           >
              <span className="text-secondary uppercase tracking-[0.3em] font-bold text-xs mb-6 block">Legacy & Tradition</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8 leading-tight">Beyond a Store. <br/> A Literary Sanctuary.</h2>
              <p className="text-gray-600 font-light leading-loose mb-10 text-lg italic">
                Our mission transcends commerce. We are dedicated to the preservation of intellectual heritage and the discovery of works that challenge, comfort, and inspire.
              </p>
              <div className="space-y-6">
                 {[
                   { title: "Meticulous Curation", desc: "Every volume is inspected by our senior curators." },
                   { title: "Exclusive Editions", desc: "Hardcovers crafted for longevity and aesthetic beauty." },
                   { title: "Expert Concierge", desc: "Personalized recommendations for your unique library." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 items-start">
                      <div className="w-6 h-6 border border-secondary flex items-center justify-center text-secondary text-[10px] font-bold shrink-0 mt-1">{i+1}</div>
                      <div>
                        <h4 className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">{item.title}</h4>
                        <p className="text-gray-500 text-sm font-light italic">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.div>
        </section>

      </div>
      
      {/* Newsletter - Premium Style */}
      <section className="bg-primary py-32 border-t border-secondary/10">
         <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl font-serif text-white mb-6">Join the Registry</h2>
            <p className="text-gray-400 font-light italic mb-12 max-w-xl mx-auto">
               Receive clandestine updates regarding rare acquisitions and seasonal collections before they reach the general public.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto border-b border-secondary/30 pb-4">
               <input 
                 type="email" 
                 placeholder="Enter your email correspondence..." 
                 className="flex-grow bg-transparent text-white font-light p-4 focus:outline-none placeholder-gray-700 italic"
               />
               <button className="text-secondary font-bold uppercase tracking-[0.2em] text-xs hover:text-white transition-colors py-4 px-6 shrink-0">
                  Register Interest
               </button>
            </form>
         </div>
      </section>
    </div>
  );
};

export default Home;
