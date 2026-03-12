import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = 0; // Assuming tax is included
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, navigate, cartItems]);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      // Simulated realistic payment delay
      setTimeout(async () => {
        try {
          await axios.put(`/api/orders/${data._id}/pay`, { status: 'success' }, config);
          setPaymentSuccess(true);
          setLoading(false);
          clearCart();
          
          setTimeout(() => {
            navigate(`/order/${data._id}`);
          }, 3000);
        } catch (err) {
          setErrorMsg('Verification successful, but receipt generation failed. Please check Your Archives.');
          setLoading(false);
        }
      }, 2500);

    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error processing purchase');
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-6 py-48 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Pulsing Gold Halo */}
          <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping"></div>
          
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-12 border-4 border-secondary shadow-[0_0_50px_rgba(212,175,55,0.3)] relative z-10">
             <div className="w-16 h-16 text-secondary flex items-center justify-center">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full stroke-[3px]"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
             </div>
          </div>
        </motion.div>

        <h1 className="text-5xl font-serif text-primary mb-6 tracking-tight leading-tight">Payment Successful</h1>
        <p className="text-gray-500 font-light italic mb-10 text-lg max-w-xl">
          Protocol complete. Your acquisition has been meticulously verified and the digital receipt is being archived in your <span className="text-primary font-bold">Order Archive</span>.
        </p>
        
        <div className="flex flex-col items-center gap-4">
           <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
           <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-secondary animate-pulse">Redirection in Progress</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl">
      <h1 className="text-4xl font-serif text-primary mb-12 text-center pb-6 border-b border-gray-200">
        Secure Checkout
      </h1>

      {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-8 text-sm text-center">{errorMsg}</div>}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          <form className="space-y-10" id="checkout-form" onSubmit={placeOrderHandler}>
            {/* Shipping Details */}
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
              <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100 flex items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3 font-sans">1</span> 
                Shipping Destination
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Street Address</label>
                  <input required type="text" className="input-field" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} placeholder="Suite, Apartment, Building details"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">City</label>
                  <input required type="text" className="input-field" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} placeholder="City name" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Postal Code</label>
                  <input required type="text" className="input-field" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} placeholder="Zip / Postal" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Country</label>
                  <input required type="text" className="input-field" value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} placeholder="Nation" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
              <h2 className="text-2xl font-serif text-primary mb-8 pb-4 border-b border-gray-100 flex items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3 font-sans">2</span> 
                Payment Authorization
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-5 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-secondary bg-yellow-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Card' ? 'border-secondary' : 'border-gray-300'}`}>
                    {paymentMethod === 'Card' && <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>}
                  </div>
                  <input type="radio" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div>
                    <span className="font-bold text-primary block">Credit or Debit Card</span>
                    <span className="text-xs text-gray-500">Secure encrypted processing via Financial Institution Verification</span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-primary text-white p-8 rounded-sm shadow-luxury border border-secondary/30 sticky top-32">
            <h2 className="text-2xl font-serif text-secondary mb-8 border-b border-white/20 pb-4">Purchase Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 shrink-scrollbar">
              {cartItems.map(item => (
                <div key={item.book} className="flex gap-4 items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="w-12 h-16 bg-white/10 p-1 flex items-center justify-center">
                    <img src={item.image || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 font-sans mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="font-bold text-sm">₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 text-gray-300 font-light border-t border-white/20 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">Merchandise</span>
                <span className="font-bold text-white">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Delivery & Handling</span>
                <span className="font-bold text-white">{shippingPrice === 0 ? 'Complimentary' : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-6">
                <span className="font-serif text-xl text-white">Total</span>
                <span className="text-secondary font-bold font-serif text-3xl">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-secondary text-primary font-bold py-4 rounded-sm hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Authorizing...' : 'Authorize Payment'}
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500/50"></span> Encrypted TLS Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
