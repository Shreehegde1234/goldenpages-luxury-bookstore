import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) return <div className="text-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 font-light">{error}</div>;
  if (!order) return <div className="text-center py-20 font-light italic text-gray-500">Document not found in our archives.</div>;

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <Link to="/profile" className="text-gray-400 hover:text-secondary mb-10 inline-block text-xs uppercase tracking-widest font-semibold transition-colors flex items-center">
        <span className="mr-2">&larr;</span> Return to Archives
      </Link>
      
      <div className="mb-10 pb-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Order <span className="text-secondary font-mono text-3xl">#{order._id.substring(0,8)}</span></h1>
          <p className="text-gray-500 font-light text-sm uppercase tracking-widest">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
           <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
             {order.orderStatus}
           </span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3 space-y-8">
          
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
            <h2 className="text-xl font-serif text-primary mb-6 pb-2 border-b border-gray-100">Dispatch Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-light text-gray-600">
               <div>
                 <strong className="block text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Recipient</strong>
                 <p>{order.user.name}</p>
                 <p>{order.user.email}</p>
               </div>
               <div>
                  <strong className="block text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Destination</strong>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
               </div>
            </div>
            {order.orderStatus === 'Delivered' && order.deliveredAt && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-sm">
                 <strong className="text-primary font-bold mr-2">Delivery Time:</strong> 
                 <span className="font-mono text-gray-500">{new Date(order.deliveredAt).toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
            <h2 className="text-xl font-serif text-primary mb-6 pb-2 border-b border-gray-100">Financial Authorization</h2>
            <div className="text-sm font-light text-gray-600">
               <p className="mb-4"><strong className="text-primary font-bold uppercase tracking-widest text-[10px] mr-2">Method:</strong> <span className="font-bold">{order.paymentMethod}</span></p>
               
               {order.paymentStatus === 'Completed' || order.isPaid ? (
                 <div className="bg-green-50 border border-green-200 text-green-700 p-3 text-xs uppercase tracking-widest font-bold flex items-center">
                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                   Authorized on {new Date(order.paidAt || order.createdAt).toLocaleDateString()}
                 </div>
               ) : (
                 <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 text-xs uppercase tracking-widest font-bold flex items-center">
                   <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                   Authorization Pending
                 </div>
               )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
            <h2 className="text-xl font-serif text-primary mb-6 pb-2 border-b border-gray-100">Purchased Editions</h2>
            {order.orderItems.length === 0 ? (
              <p className="text-gray-500 font-light italic">Invoice is empty.</p>
            ) : (
              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-6 items-center border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="w-16 h-24 bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link to={`/book/${item.book}`} className="font-serif font-bold text-lg text-primary hover:text-secondary line-clamp-1 mb-1 transition-colors">{item.name}</Link>
                      <p className="text-xs text-gray-400 font-sans uppercase tracking-widest space-x-2">
                        <span>Qty: {item.qty}</span>
                        <span>&bull;</span>
                        <span>₹{item.price}</span>
                      </p>
                    </div>
                    <div className="font-serif font-bold text-primary text-xl">
                       ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-primary text-white p-8 rounded-sm shadow-luxury border border-secondary/30 sticky top-32">
            <h2 className="text-2xl font-serif text-secondary mb-8 border-b border-white/20 pb-4">Invoice Summary</h2>
            <div className="space-y-4 mb-6 font-light text-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-sm">Merchandise</span>
                <span className="font-bold text-white">₹{order.itemsPrice || order.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Delivery</span>
                <span className="font-bold text-white">₹{order.shippingPrice || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-6">
                <span className="font-serif text-xl text-white">Grand Total</span>
                <span className="text-secondary font-bold font-serif text-3xl">₹{order.totalPrice}</span>
              </div>
            </div>
            
             <a href={`mailto:concierge@goldenpages.com?subject=Inquiry regarding Order #${order._id}`} className="mt-8 block text-center border border-white/20 hover:border-secondary text-gray-300 transition-colors py-3 text-xs uppercase tracking-widest font-bold">Contact Concierge</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
