import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto text-center"
      >
        <h1 className="text-5xl font-serif text-primary mb-8">Direct Correspondence</h1>
        <p className="text-gray-400 mb-16 italic font-light">
          Your inquiries are valued. Allow our concierge to assist you with your literary requirements.
        </p>
        
        <form className="space-y-8 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">FullName</label>
            <input type="text" className="w-full bg-white border border-gray-100 p-4 focus:outline-none focus:border-secondary transition-colors text-sm" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Digital Correspondence</label>
            <input type="email" className="w-full bg-white border border-gray-100 p-4 focus:outline-none focus:border-secondary transition-colors text-sm" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Your Inquire</label>
            <textarea rows="4" className="w-full bg-white border border-gray-100 p-4 focus:outline-none focus:border-secondary transition-colors text-sm" placeholder="How may we assist?"></textarea>
          </div>
          <button className="w-full bg-primary text-white py-4 font-bold tracking-[0.2em] uppercase text-xs hover:bg-secondary transition-all">
            Inquire Details
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
