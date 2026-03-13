import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <h1 className="text-2xl md:text-4xl font-serif text-primary mb-6 md:mb-10 border-b border-gray-200 pb-4 md:pb-6 flex justify-between items-end">
        <span>Shopping Bag</span>
        <span className="text-[10px] md:text-sm font-sans font-normal uppercase tracking-widest text-gray-400">{totalItems} Items</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-16 rounded-sm shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-6">
            <span className="text-gray-300 text-3xl font-serif">G</span>
          </div>
          <p className="text-xl text-primary mb-8 font-serif italic font-light">Your bag is currently empty.</p>
          <Link to="/" className="btn-primary px-10 py-3 text-sm">
            Curate Your Collection
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              
              <div className="hidden sm:grid grid-cols-12 gap-4 py-4 px-8 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <div className="col-span-6">Edition</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.book} className="grid grid-cols-1 sm:grid-cols-12 gap-8 py-8 px-8 border-b border-gray-100 items-center last:border-0 group hover:bg-gray-50/30 transition-colors">
                  <div className="col-span-1 sm:col-span-6 flex items-start gap-4 md:gap-6">
                    <div className="w-16 h-24 md:w-20 md:h-28 bg-gray-50 border border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center p-1">
                      <img src={item.image || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col pt-1">
                      <Link to={`/book/${item.book}`} className="font-serif font-bold text-base md:text-lg text-primary hover:text-secondary line-clamp-2 leading-tight mb-2 transition-colors">
                        {item.title}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.book)}
                        className="text-gray-400 hover:text-red-500 text-[10px] tracking-wider uppercase flex items-center gap-1 transition-colors w-max mt-2 md:mt-4"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2 text-center font-bold text-primary font-serif sm:text-lg">
                    <span className="sm:hidden text-gray-400 font-sans text-xs uppercase tracking-widest font-normal mr-2">Price:</span>
                    ₹{item.price}
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2 flex justify-center items-center">
                    <span className="sm:hidden text-gray-400 font-sans text-xs uppercase tracking-widest font-normal mr-2">Qty:</span>
                    <select
                      className="p-2 border border-gray-200 rounded-sm bg-white focus:outline-none focus:border-secondary transition-colors font-semibold"
                      value={item.qty}
                      onChange={(e) => updateQty(item.book, Number(e.target.value))}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center font-bold text-primary font-serif sm:text-lg">
                    <div>
                      <span className="sm:hidden text-gray-400 font-sans text-xs uppercase tracking-widest font-normal mr-2">Total:</span>
                      ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-primary text-white p-8 rounded-sm shadow-luxury border border-secondary/30 sticky top-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-white/10 mt-4 mr-4"></div>
              <h2 className="text-2xl font-serif text-secondary mb-8 border-b border-white/20 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 font-light text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm tracking-wide">Subtotal ({totalItems} items)</span>
                  <span className="text-white font-bold font-serif text-lg">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm tracking-wide">Complimentary Shipping</span>
                  <span className="text-white font-bold text-sm tracking-widest uppercase">Included</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-6">
                  <span className="text-white font-serif text-lg md:text-xl">Estimated Total</span>
                  <span className="text-secondary font-bold font-serif text-2xl md:text-3xl">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-secondary text-primary font-bold py-4 rounded-sm hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm shadow-luxury"
                onClick={checkoutHandler}
              >
                Secure Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
