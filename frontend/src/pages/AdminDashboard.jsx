import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book as BookIcon, Users, ShoppingBag, DollarSign, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/admin/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading) return <div className="text-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="container mx-auto px-6 py-16 max-w-7xl">
       <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Executive Dashboard</h1>
          <p className="text-gray-500 font-light text-sm uppercase tracking-widest">Platform Telemetry & Administration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-primary w-24 h-24 rounded-bl-full flex items-start justify-end"></div>
          <Users className="text-secondary mb-4 relative z-10" size={28} />
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1 relative z-10">Registered Patrons</p>
          <p className="text-4xl font-serif font-bold text-primary relative z-10">{stats.usersCount}</p>
        </div>
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary transition-colors relative overflow-hidden">
          <BookIcon className="text-secondary mb-4 relative z-10" size={28} />
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1 relative z-10">Catalog Size</p>
          <p className="text-4xl font-serif font-bold text-primary relative z-10">{stats.booksCount}</p>
        </div>
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary transition-colors relative overflow-hidden">
          <ShoppingBag className="text-secondary mb-4 relative z-10" size={28} />
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1 relative z-10">Total Invoices</p>
          <p className="text-4xl font-serif font-bold text-primary relative z-10">{stats.ordersCount}</p>
        </div>
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary transition-colors relative overflow-hidden">
          <DollarSign className="text-secondary mb-4 relative z-10" size={28} />
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1 relative z-10">Gross Revenue</p>
          <p className="text-4xl font-serif font-bold text-primary relative z-10">₹{stats.totalRevenue?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100 flex items-center">
             <Settings className="mr-3 text-secondary" size={24} />
             System Configuration
          </h2>
          <div className="space-y-4">
            <Link to="/admin/books" className="group flex justify-between items-center border border-gray-100 bg-gray-50/50 p-6 rounded-sm hover:border-secondary transition-colors">
               <div>
                  <h3 className="font-serif font-bold text-lg text-primary mb-1">Catalog Management</h3>
                  <p className="text-gray-500 font-light text-xs">Curate new editions, amend descriptions, or remove titles.</p>
               </div>
               <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">&rarr;</span>
            </Link>
            <Link to="/admin/orders" className="group flex justify-between items-center border border-gray-100 bg-gray-50/50 p-6 rounded-sm hover:border-secondary transition-colors">
               <div>
                  <h3 className="font-serif font-bold text-lg text-primary mb-1">Fulfillment Center</h3>
                  <p className="text-gray-500 font-light text-xs">Monitor incoming orders and process dispatch authorizations.</p>
               </div>
               <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="bg-primary text-white p-10 rounded-sm shadow-luxury border border-secondary/20 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
          <h2 className="text-2xl font-serif text-secondary mb-8 pb-4 border-b border-white/10 relative z-10">Global Patrons Broadcast</h2>
          <form className="space-y-6 relative z-10" onSubmit={async (e) => { 
            e.preventDefault(); 
            const title = e.target[0].value;
            const message = e.target[1].value;
            try {
              const config = { headers: { Authorization: `Bearer ${user.token}` } };
              await axios.post('/api/admin/announcements', { title, message }, config);
              alert('Broadcast published across platform successfully.');
              e.target.reset();
            } catch (err) {
              alert('Error transmitting broadcast. Please try again.');
            }
          }}>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Subject Header</label>
              <input type="text" className="w-full p-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-secondary text-white font-serif text-lg transition-colors placeholder-gray-600" placeholder="A new masterpiece has arrived..." />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Broadcast Contents</label>
              <textarea rows="4" className="w-full p-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-secondary text-gray-300 font-light transition-colors placeholder-gray-600" placeholder="Notify your bibliophiles..."></textarea>
            </div>
            <button className="bg-secondary text-primary font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors text-xs uppercase tracking-widest shadow-luxury">
              Transmit Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
