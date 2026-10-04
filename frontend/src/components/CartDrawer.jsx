// frontend/src/components/CartDrawer.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CreditCard } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, removeFromCart, onCheckout }) {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Glass Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Smooth Sliding Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl z-50 p-6 flex flex-col text-white"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold tracking-wide">Your PrinceKart Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* List of Cart Items */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-slate-500 text-center mt-12">Your cart is feeling light...</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-900/50 p-3 border border-slate-800/60 rounded-xl">
                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-200 line-clamp-1">{item.name}</h4>
                      <p className="text-blue-400 font-bold text-sm mt-1">${item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-slate-500 hover:text-red-400 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Section */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-800 pt-4 mt-auto">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-xl font-bold text-white">${totalPrice}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  <CreditCard size={18} />
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}