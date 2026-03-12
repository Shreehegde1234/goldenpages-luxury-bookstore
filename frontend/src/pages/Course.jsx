import React from 'react';
import { motion } from 'framer-motion';

const Course = () => {
  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-serif text-primary mb-6">Our Literary Courses</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
          Deepen your appreciation for the written word through our curated seminars and workshops. 
          Expertly led sessions designed for the discerning reader.
        </p>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-secondary/20 p-8 hover:bg-secondary/5 transition-colors">
              <h3 className="text-xl font-serif text-primary mb-4">Seminar Volume {i}</h3>
              <p className="text-sm text-gray-400 mb-6">Coming soon to the sanctuary.</p>
              <div className="text-secondary font-bold tracking-widest text-xs">ENROLLMENT PENDING</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Course;
