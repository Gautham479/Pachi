"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Articulated Dragon',
    description: 'A fully flexible printed dragon with stunning details.',
    material: 'Silk',
    price: 1599,
    imageColor: 'from-[#ff7e5f] to-[#feb47b]'
  },
  {
    id: 'p2',
    name: 'Minimalist Headphone Stand',
    description: 'Sleek geometric design to keep your desk organized.',
    material: 'Matte PETG',
    price: 999,
    imageColor: 'from-[#2193b0] to-[#6dd5ed]'
  },
  {
    id: 'p3',
    name: 'Topology Planter',
    description: 'Mathematical topological surface designed for indoor plants.',
    material: 'Wood-fill PLA',
    price: 2499,
    imageColor: 'from-[#11998e] to-[#38ef7d]'
  },
  {
    id: 'p4',
    name: 'Ergonomic Macropad Case',
    description: 'Custom 3D printed case for 9-key mechanical macropads.',
    material: 'ABS',
    price: 850,
    imageColor: 'from-[#bdc3c7] to-[#2c3e50]'
  },
  {
    id: 'p5',
    name: 'Voronoi Pen Holder',
    description: 'Abstract voronoi patterned desk accessory.',
    material: 'Resin',
    price: 1200,
    imageColor: 'from-[#8e2de2] to-[#4a00e0]'
  },
  {
    id: 'p6',
    name: 'Mechanical Gyroscope',
    description: 'Print-in-place moving mechanical toy.',
    material: 'PLA',
    price: 550,
    imageColor: 'from-[#f12711] to-[#f5af19]'
  }
];

export default function ProductsGrid() {
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);

  const handleAddToCart = (product) => {
    addDirectItemToCart({
      fileName: product.name,
      config: { material: product.material, quality: 'Pre-printed', color: 'As shown' },
      price: product.price
    });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PRODUCTS.map((product, idx) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="bg-[#1a1a1b]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-[rgba(249,115,22,0.3)] transition-all group flex flex-col h-full"
        >
          {/* Placeholder Image using gradients */}
          <div className={`w-full h-48 bg-gradient-to-br ${product.imageColor} relative opacity-80 group-hover:opacity-100 transition-opacity`}>
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white/80 font-medium tracking-widest uppercase text-sm drop-shadow-md">
                     3D Model
                 </span>
             </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-medium text-lg">{product.name}</h3>
              <span className="text-brand-orange font-bold">₹{product.price}</span>
            </div>
            
            <p className="text-white/60 text-sm mb-4 flex-grow">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/70 font-medium">
                {product.material}
              </span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/70 font-medium">
                Pre-printed
              </span>
            </div>

            <button 
              onClick={() => handleAddToCart(product)}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-brand-orange hover:text-white text-white/90 font-medium transition-all flex items-center justify-center gap-2 text-sm mt-auto group-hover:border-transparent border border-white/10"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
