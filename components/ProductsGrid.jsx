"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { AVAILABLE_COLORS, PRODUCT_TYPES } from '@/lib/catalog';

function ProductCard({ product, handleAddToCart, updateProductColorOption, productColorOptions }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];

  useEffect(() => {
    let interval;
    if (isHovered && uniqueImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
      }, 1000);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, uniqueImages.length]);

  const displayImage = uniqueImages[currentImageIndex] || '';

  return (
    <div className="flex flex-col h-full">
      <Link href={`/products/${product.slug}`} className="flex-grow flex flex-col cursor-pointer transform transition-all hover:scale-[1.02]">
        <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image */}
          <div className="w-full aspect-[4/3] relative opacity-90 group-hover:opacity-100 transition-opacity bg-surface-muted overflow-hidden">
             {displayImage ? (
               <Image
                 src={displayImage}
                 alt={product.name}
                 fill
                 className="object-contain w-full h-full p-3 transition-opacity duration-300"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
             ) : (
               <div className={`w-full h-full bg-gradient-to-br ${product.imageColor}`}>
                 <div className="absolute inset-0 bg-black/10 dark:bg-white/10" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-white font-medium tracking-widest uppercase text-sm drop-shadow-md">
                     3D Model
                   </span>
                 </div>
               </div>
             )}
             {/* Pagination Dots for hover feedback */}
             {uniqueImages.length > 1 && isHovered && (
               <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                 {uniqueImages.map((_, i) => (
                   <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary-500 w-3' : 'bg-black/30 dark:bg-white/40'}`} />
                 ))}
               </div>
             )}
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-fg font-medium text-lg line-clamp-1">{product.name}</h3>
              <span className="text-primary-600 font-bold ml-3">₹{product.price}</span>
            </div>
            
            <p className="text-fg-muted text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2 py-1 bg-surface-muted rounded text-xs text-fg-muted font-medium border border-surface-border">
                {product.material}
              </span>
              <span className="px-2 py-1 bg-surface-muted rounded text-xs text-fg-muted font-medium border border-surface-border">
                {product.type}
              </span>
              {!product.inStock && (
                <span className="px-2 py-1 bg-amber-500/15 rounded text-xs text-amber-600 font-semibold border border-amber-500/30">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="space-y-2 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateProductColorOption(product.id, { colorMode: 'Single Color', color: productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name });
                  }}
                  className={`text-xs rounded-md border px-2 py-1.5 font-semibold transition-colors ${
                    (productColorOptions[product.id]?.colorMode || 'Single Color') === 'Single Color'
                      ? 'border-primary-500 bg-primary-500/10 text-fg'
                      : 'border-surface-border bg-surface-muted text-fg-muted hover:border-surface-border/80'
                  }`}
                >
                  Single Color
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateProductColorOption(product.id, { colorMode: 'Multicolor', color: 'Multicolor' });
                  }}
                  className={`text-xs rounded-md border px-2 py-1.5 font-semibold transition-colors ${
                    (productColorOptions[product.id]?.colorMode || 'Single Color') === 'Multicolor'
                      ? 'border-primary-500 bg-primary-500/10 text-fg'
                      : 'border-surface-border bg-surface-muted text-fg-muted hover:border-surface-border/80'
                  }`}
                >
                  Multicolor
                </button>
              </div>

              {(productColorOptions[product.id]?.colorMode || 'Single Color') === 'Single Color' && (
                <select
                  value={productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => updateProductColorOption(product.id, { colorMode: 'Single Color', color: e.target.value })}
                  className="w-full bg-surface-muted border border-surface-border rounded-md px-2 py-1.5 text-xs text-fg focus:outline-none focus:border-primary-500/50 transition-colors"
                >
                  {AVAILABLE_COLORS.map((color) => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button 
        disabled={!product.inStock}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart(product);
        }}
        className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm mt-3 shadow-md shadow-black/10 dark:shadow-black/40 ${
          product.inStock
            ? 'bg-cta hover:opacity-90 text-cta-contrast'
            : 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed shadow-none'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

export default function ProductsGrid() {
  const [selectedType, setSelectedType] = useState('All');
  const [productColorOptions, setProductColorOptions] = useState({});
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const [loading, setLoading] = useState(!products || products.length === 0);
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = ['All', ...PRODUCT_TYPES];

  useEffect(() => {
    const loadProducts = async () => {
      // Fetch in background if we already have cache
      if (!products || products.length === 0) setLoading(true);
      const response = await fetch('/api/products?includeOutOfStock=1');
      const data = await response.json().catch(() => []);
      if (Array.isArray(data)) {
        setProducts(data);
      }
      setLoading(false);
    };

    loadProducts();
  }, [setProducts]); // only depend on setter, not products, to prevent looping

  const activeType = searchQuery.trim() ? 'All' : selectedType;

  const filteredProducts = (products || []).filter((product) => {
    const typeMatches = activeType === 'All' || product.type === activeType;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryMatches =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.type.toLowerCase().includes(normalizedQuery);

    return typeMatches && queryMatches;
  });

  const handleAddToCart = (product) => {
    const productOption = productColorOptions[product.id] || {
      colorMode: 'Single Color',
      color: AVAILABLE_COLORS[0].name,
    };

    addDirectItemToCart({
      fileName: product.name,
      config: {
        material: product.material,
        quality: 'Pre-printed',
        colorMode: productOption.colorMode,
        color: productOption.colorMode === 'Multicolor' ? 'Multicolor' : productOption.color,
        strength: 20
      },
      price: product.price
    });
    openCart();
  };

  const updateProductColorOption = (productId, updates) => {
    setProductColorOptions((prev) => {
      const current = prev[productId] || { colorMode: 'Single Color', color: AVAILABLE_COLORS[0].name };
      return {
        ...prev,
        [productId]: { ...current, ...updates },
      };
    });
  };

  return (
    <div>
      {/* Horizontal Product Types Filter */}
      <div className="mb-10 overflow-x-auto pb-2">
        <div className="flex gap-3">
          {filters.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeType === type
                  ? 'bg-cta text-cta-contrast shadow-md shadow-black/10 dark:shadow-black/40'
                  : 'bg-surface-muted text-fg-muted hover:text-fg border border-surface-border hover:border-primary-500/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full aspect-[3/4] bg-surface-muted animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5), duration: 0.4 }}
          >
            <ProductCard 
              product={product} 
              handleAddToCart={handleAddToCart}
              updateProductColorOption={updateProductColorOption}
              productColorOptions={productColorOptions}
            />
          </motion.div>
        ))}
        {filteredProducts.length === 0 && !loading && (
           <div className="col-span-full py-12 text-center">
             <p className="text-fg-muted text-lg">No products found matching your criteria.</p>
             <button onClick={() => { setSelectedType('All'); useStore.getState().setSearchQuery(''); }} className="mt-4 px-4 py-2 bg-surface-muted rounded-lg text-fg hover:bg-surface-border transition-colors">
               Clear Filters
             </button>
           </div>
        )}
      </div>
      )}
    </div>
  );
}
