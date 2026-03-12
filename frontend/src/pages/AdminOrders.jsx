import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (id) => {
    if(!window.confirm('Authorize dispatching this order to Delivered status?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error executing transition');
    }
  };

  if (loading) return <div className="text-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Fulfillment Control</h1>
          <p className="text-gray-500 font-light text-sm uppercase tracking-widest">Global Logistics Database</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto shrink-scrollbar">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reference ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valuation</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400 font-bold uppercase tracking-wider">
                     <Link to={`/order/${order._id}`} className="hover:text-secondary hover:underline">{order._id.substring(0, 8)}</Link>
                  </td>
                  <td className="px-6 py-4 font-serif font-bold text-primary">{order.user?.name || 'Unknown Entity'}</td>
                  <td className="px-6 py-4 text-gray-500 font-light text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-serif font-bold text-primary text-lg">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link to={`/order/${order._id}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Inspect</Link>
                    {order.orderStatus !== 'Delivered' && (
                      <button 
                        onClick={() => handleDeliver(order._id)}
                        className="bg-secondary text-primary px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-primary shadow-sm hover:text-white transition-colors border border-transparent"
                      >
                        Authorize Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="6" className="p-12 text-center text-gray-500 font-light italic">No logistical anomalies to report.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
