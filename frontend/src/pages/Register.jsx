import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passcodes do not match.');
      return;
    }
    const result = await register(name, email, password);
    if (!result.success) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-32 flex justify-center items-center min-h-[85vh] relative text-[10px]">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white p-12 md:p-16 shadow-2xl relative overflow-hidden group"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-2 h-full bg-secondary"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-gray-100 mb-8 ml-8 pointer-events-none group-hover:block transition-all duration-700"></div>

        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             transition={{ delay: 0.2, duration: 0.5 }}
             className="w-12 h-12 border border-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-serif text-xl"
           >
             G
           </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4 tracking-tight">The Registry</h2>
          <p className="text-gray-500 font-light italic leading-relaxed text-sm px-4">"Join our exclusive circle of bibliophiles."</p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="bg-red-50 text-red-700 px-6 py-4 mb-8 text-xs uppercase tracking-widest font-bold border border-red-200 text-center"
          >
            {errorMsg}
          </motion.div>
        )}
        
        <form onSubmit={submitHandler} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="col-span-1 md:col-span-2">
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Full Identity</label>
               <input 
                 type="text" 
                 className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-secondary focus:bg-white transition-colors placeholder-gray-400 font-light italic text-sm"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Lady Mary Wortley Montagu"
                 required
               />
             </div>
             
             <div className="col-span-1 md:col-span-2">
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Digital Correspondence</label>
               <input 
                 type="email" 
                 className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-secondary focus:bg-white transition-colors placeholder-gray-400 font-light italic text-sm"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="name@domain.com"
                 required
               />
             </div>
             
             <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Secure Passcode</label>
               <input 
                 type="password" 
                 className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-secondary focus:bg-white transition-colors placeholder-gray-400 font-light italic text-sm"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                 required
               />
             </div>

             <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Validate Passcode</label>
               <input 
                 type="password" 
                 className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-secondary focus:bg-white transition-colors placeholder-gray-400 font-light italic text-sm"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                 required
               />
             </div>
          </div>
          
          <motion.button 
            whileHover={{ backgroundColor: "#0F0F0F", color: "#FFFFFF" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-secondary text-primary py-5 uppercase tracking-[0.3em] font-bold text-xs transition-colors shadow-luxury mt-8"
          >
            Submit Application
          </motion.button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-500 font-light flex justify-center gap-2 items-center italic">
          Already a recognized member? 
          <Link to="/login" className="luxury-link text-primary font-bold uppercase tracking-widest px-1 ml-1 text-[10px] not-italic">
            Access The Vault
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
