import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, wishlist, settings
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: myOrders } = await axios.get('/api/orders/myorders', config);
        setOrders(myOrders);

        const { data: myProfile } = await axios.get('/api/users/profile', config);
        setWishlist(myProfile.wishlist);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleRemoveWishlist = async (id) => {
     try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`/api/users/wishlist/${id}`, {}, config);
        // refetch profile
        const { data: myProfile } = await axios.get('/api/users/profile', config);
        setWishlist(myProfile.wishlist);
      } catch (error) {
        console.error(error);
      }
  };

  if (loading) return <div className="text-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl">
       <div className="bg-primary text-white p-12 rounded-sm shadow-luxury mb-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <h1 className="text-4xl font-serif mb-2 relative z-10">{user.name}</h1>
         <p className="text-gray-400 font-light relative z-10">{user.email}</p>
         {user.role === 'admin' && (
           <span className="inline-block mt-4 px-3 py-1 bg-secondary text-primary text-xs font-bold uppercase tracking-widest rounded-sm">Administrator</span>
         )}
       </div>

       <div className="flex flex-col md:flex-row gap-10">
         <div className="w-full md:w-1/4">
           <div className="flex flex-col border border-gray-100 rounded-sm bg-white shadow-sm pb-2">
             <button 
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-left border-b border-gray-100 uppercase tracking-widest text-xs font-bold transition-colors ${activeTab === 'orders' ? 'text-primary bg-gray-50 border-l-2 border-l-secondary inline-block' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Order History
             </button>
             <button 
                onClick={() => setActiveTab('wishlist')}
                className={`py-4 px-6 text-left border-b border-gray-100 uppercase tracking-widest text-xs font-bold transition-colors ${activeTab === 'wishlist' ? 'text-primary bg-gray-50 border-l-2 border-l-secondary inline-block' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Wishlist Collection
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-left uppercase tracking-widest text-xs font-bold transition-colors ${activeTab === 'settings' ? 'text-primary bg-gray-50 border-l-2 border-l-secondary inline-block' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Account Settings
             </button>
           </div>
         </div>

         <div className="w-full md:w-3/4">
            {activeTab === 'orders' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                 <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100">Order Archives</h2>
                 {orders.length === 0 ? (
                    <p className="text-gray-500 font-light italic">Your order history is empty.</p>
                 ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                         <div key={order._id} className="border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center group hover:border-secondary/30 transition-colors">
                            <div className="w-full md:w-auto mb-4 md:mb-0">
                               <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Order #{order._id.substring(0,8)}</p>
                               <p className="font-serif text-primary text-xl font-bold mb-1">₹{order.totalPrice}</p>
                               <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="w-full md:w-auto flex items-center justify-between md:flex-col items-end gap-3">
                               <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                                 {order.orderStatus}
                               </span>
                               <Link to={`/order/${order._id}`} className="text-sm font-bold text-secondary hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">View Details</Link>
                            </div>
                         </div>
                      ))}
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                 <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100">Curated Wishlist</h2>
                 {wishlist.length === 0 ? (
                    <p className="text-gray-500 font-light italic">Your wishlist is currently empty. Discover new additions in our catalog.</p>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {wishlist.map(book => (
                         <div key={book._id} className="border border-gray-100 flex p-4 hover:border-secondary/30 transition-colors">
                            <div className="w-20 bg-gray-50 p-1 flex items-center justify-center shrink-0 border border-gray-100">
                               <img src={book.image || '/placeholder.png'} className="w-full h-auto" alt={book.title} />
                            </div>
                            <div className="ml-4 flex flex-col justify-center w-full">
                               <Link to={`/book/${book._id}`} className="font-serif font-bold text-primary group-hover:text-secondary mb-1 line-clamp-1">{book.title}</Link>
                               <p className="font-serif text-gray-500 text-sm mb-3">₹{book.price}</p>
                               <button 
                                 onClick={() => handleRemoveWishlist(book._id)}
                                 className="text-xs uppercase tracking-widest text-red-400 hover:text-red-700 text-left"
                               >
                                 Remove
                               </button>
                            </div>
                         </div>
                      ))}
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                  <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100">Account Preferences</h2>
                  <p className="text-gray-500 font-light italic">Preference configuration features are currently under development. To modify your account details, please contact our support concierges.</p>
              </div>
            )}
         </div>
       </div>
    </div>
  );
};

export default Profile;
