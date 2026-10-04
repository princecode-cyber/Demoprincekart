// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Search, UserCircle, ShoppingCart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ cartCount, searchInput, setSearchInput, onCartOpen }) {
  const [user, setUser] = useState(null); // Simulated session state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if(usernameInput.trim()) {
      setUser({ name: usernameInput });
      setShowAuthModal(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center text-slate-100">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSearchInput(""); }}>
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-xl tracking-tighter shadow-lg shadow-blue-500/30">
            P
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            PRINCEKART
          </h1>
        </div>

        {/* Real-time Dynamic Search Box */}
        <div className="w-full md:flex-1 max-w-xl mx-0 md:mx-8 flex relative">
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to filter products instantaneously..." 
            className="w-full bg-[#0f172a] border border-slate-800 focus:border-blue-500 p-3 pl-11 rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-500"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
        </div>

        {/* Authentication Panel & Bag Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-blue-400 font-medium">Hi, {user.name}</span>
              <button onClick={() => setUser(null)} className="text-slate-400 hover:text-red-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <motion.button 
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 px-4 py-2 rounded-xl hover:border-blue-500/60 transition-all text-sm font-medium text-blue-400"
            >
              <UserCircle size={18} />
              Sign In
            </motion.button>
          )}
          
          <button 
            onClick={onCartOpen}
            className="relative bg-slate-900 border border-slate-800 p-2.5 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <ShoppingCart size={18} className="text-indigo-400" />
            <span className="text-sm font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Dynamic Animated Authentic Auth Popover Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-sm text-white shadow-2xl"
            >
              <h3 className="text-xl font-bold tracking-wide text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">Welcome to PrinceKart</h3>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Name</label>
                  <input required type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Enter username..." className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAuthModal(false)} className="w-1/2 border border-slate-800 hover:bg-slate-900 py-2.5 rounded-xl text-sm text-slate-400">Cancel</button>
                  <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-blue-600/20">Login</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}