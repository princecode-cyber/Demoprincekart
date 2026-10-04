
// frontend/src/components/CategoryNav.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryNav({ activeCategory, setActiveCategory }) {
  const categories = [
    { name: 'All Items', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150' },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150' },
    { name: 'Apparel', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150' }
  ];

  return (
    <nav className="bg-[#0B0F19] border-b border-slate-800/80 px-6 py-6 overflow-x-auto">
      <div className="max-w-5xl mx-auto flex justify-center gap-8 min-w-max">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.name;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 border w-28 ${
                isActive 
                  ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5' 
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
              </div>
              <span className={`text-xs font-semibold tracking-wide transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {cat.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}