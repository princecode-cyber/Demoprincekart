// frontend/src/components/ProductCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, addToCart }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-slate-900 border border-slate-800 text-white rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/10 transition-shadow duration-300"
    >
      {/* Dynamic Animated Image Window */}
      <div className="overflow-hidden relative group">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <span className="absolute top-3 left-3 bg-blue-600 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest">
          {product.category}
        </span>
      </div>

      {/* Info Block */}
      <div className="p-5">
        <h3 className="text-xl font-semibold tracking-tight text-slate-100">{product.name}</h3>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ${product.price}
          </span>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}