// frontend/src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, totalAmount, clearCart }) {
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Processing Animation, Step 3: Success

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Jump directly to processing spinner
    setTimeout(() => {
      setStep(3); // Show success splash checkmark after 2.5 seconds simulation
    }, 2500);
  };

  const finalizeEverything = () => {
    clearCart();
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md text-white shadow-2xl relative"
          >
            {step === 1 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Secure Payment Checkout</h3>
                <p className="text-sm text-slate-400">Total payable order amount: <span className="text-white font-semibold">${totalAmount}</span></p>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cardholder Name</label>
                  <input required type="text" placeholder="Prince" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dummy Credit Card Number</label>
                  <input required type="text" maxLength="16" placeholder="4111 2222 3333 4444" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input required type="text" placeholder="MM/YY" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm text-center focus:outline-none focus:border-blue-500" />
                  <input required type="password" maxLength="3" placeholder="CVV" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm text-center focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={onClose} className="w-1/2 border border-slate-800 hover:bg-slate-800 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-sm font-semibold">Pay Securely</button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 size={48} className="text-blue-500" />
                </motion.div>
                <h3 className="text-lg font-medium">Verifying with Bank Network...</h3>
                <p className="text-xs text-slate-500">Securing your dynamic e-commerce order safe tokens</p>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="text-green-400">
                  <CheckCircle size={56} />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-400">Order Confirmed!</h3>
                <p className="text-sm text-slate-300">Thank you for purchasing at PrinceKart! Your payment transaction was logged smoothly.</p>
                <button onClick={finalizeEverything} className="mt-4 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl text-sm">
                  Return to Storefront
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}