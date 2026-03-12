import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-serif text-primary mb-12">The GoldenPages Legacy</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-gray-500 leading-relaxed font-light">
            <p>
              Founded on the belief that books are not mere objects, but vessels of human experience, 
              GoldenPages has served as a sanctuary for bibliophiles since its inception.
            </p>
            <p>
              Our collection is meticulously curated by a team of dedicated scholars and aesthetes, 
              ensuring that every volume we offer meets the highest standards of literary and physical excellence.
            </p>
          </div>
          <div className="bg-primary/5 aspect-[4/5] flex items-center justify-center p-12 border border-secondary/10">
            <div className="text-6xl font-serif text-secondary/30">G</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
