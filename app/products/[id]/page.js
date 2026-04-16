"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Check, ChevronLeft, ChevronRight, Layers, Ruler, Weight, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { AVAILABLE_COLORS } from '@/lib/catalog';

const getProductImages = (product) => {
  if (!product) return [];
  const all = [product.image, ...(product.images || [])].filter(Boolean);
  return [...new Set(all)];
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [zoom, setZoom] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState('');
  const [colorMode, setColorMode] = useState('Single Color');
  const [singleColor, setSingleColor] = useState('Black');
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);

  const images = getProductImages(product);
  const currentImageIndex = images.indexOf(selectedImage);

  const handleNextImage = (e) => {
    e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) { setProduct(null); return; }
      const data = await response.json();
      setProduct(data);
      const imgs = getProductImages(data);
      setSelectedImage(imgs[0] || '');

      const productsResponse = await fetch('/api/products?includeOutOfStock=1');
      const allProducts = await productsResponse.json().catch(() => []);
      if (Array.isArray(allProducts)) {
        setRelatedProducts(allProducts.filter((item) => item.slug !== data.slug).slice(0, 3));
      }
    };
    if (params.id) loadProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addDirectItemToCart({
        fileName: product.name,
        config: {
          material: product.material,
          quality: 'Pre-printed',
          colorMode,
          color: colorMode === 'Multicolor' ? 'Multicolor' : singleColor,
          strength: 20
        },
        price: product.price
      });
      setAddedToCart(true);
      openCart();
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleImageMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-bg">
        <Navbar />
        <CartDrawer />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-xl border-2 border-primary-500/30 border-t-primary-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const specs = [
    { icon: <Ruler className="w-4 h-4" />, label: 'Dimensions', value: product.dimensions },
    { icon: <Weight className="w-4 h-4" />, label: 'Weight', value: product.weight },
    { icon: <Clock className="w-4 h-4" />, label: 'Print Time', value: product.printTime },
    { icon: <Layers className="w-4 h-4" />, label: 'Material', value: product.material },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-bg relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <CartDrawer />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Back */}
        <motion.button
          onClick={() => router.back()}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-fg-muted hover:text-fg transition-colors mb-8 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-center relative overflow-visible w-full group">
              <motion.div
                onMouseEnter={() => setImageHovered(true)}
                onMouseLeave={() => { setImageHovered(false); setZoom({ x: 0, y: 0 }); }}
                onMouseMove={handleImageMouseMove}
                className="w-full max-w-xl aspect-[4/3] rounded-3xl relative overflow-hidden cursor-zoom-in border border-primary-500/20 bg-surface-card/70 backdrop-blur-sm"
                style={{ boxShadow: '0 0 40px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.1)' }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-500/40 rounded-tl-3xl pointer-events-none z-10" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-500/40 rounded-tr-3xl pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-500/40 rounded-bl-3xl pointer-events-none z-10" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-500/40 rounded-br-3xl pointer-events-none z-10" />

                {/* Scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-500/40 to-transparent pointer-events-none z-10"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        className="object-contain w-full h-full p-4"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-muted animate-pulse" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface-bg/80 backdrop-blur-sm p-3 rounded-xl text-fg hover:bg-primary-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-surface-border z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface-bg/80 backdrop-blur-sm p-3 rounded-xl text-fg hover:bg-primary-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-surface-border z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {!imageHovered && (
                  <div className="absolute inset-0 flex items-end justify-center pb-5 z-10">
                    <span className="text-white/70 text-xs font-bold bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                      Hover to zoom
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Zoom panel */}
              {imageHovered && selectedImage && (
                <div
                  className="absolute top-0 rounded-3xl shadow-2xl overflow-hidden border-2 border-primary-500/40 pointer-events-none z-50 w-[480px] h-[480px] hidden lg:block"
                  style={{ left: 'calc(100% + 2rem)', boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}
                >
                  <Image
                    src={selectedImage}
                    alt={`${product.name} zoomed`}
                    fill
                    className="object-cover"
                    style={{
                      transform: 'scale(2.5)',
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transition: 'transform 0.05s ease-out'
                    }}
                    sizes="480px"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    2.5x Zoom
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {getProductImages(product).length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {getProductImages(product).map((imageUrl) => (
                  <motion.button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden relative transition-all ${
                      selectedImage === imageUrl
                        ? 'border-primary-500 shadow-lg'
                        : 'border-surface-border opacity-60 hover:opacity-100 hover:border-primary-500/50'
                    }`}
                    style={selectedImage === imageUrl ? { boxShadow: '0 0 15px rgba(99,102,241,0.3)' } : {}}
                  >
                    <Image src={imageUrl} alt="Product thumbnail" fill className="object-cover" sizes="64px" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Type badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm font-black border border-primary-500/20">
                  {product.type}
                </span>
                {!product.inStock && (
                  <span className="px-3 py-1 rounded-full text-sm font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Currently out of stock
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black text-fg mb-3">{product.name}</h1>
              <p className="text-fg-muted text-base mb-8 leading-relaxed">{product.fullDescription}</p>

              {/* Specs */}
              <div className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-sm p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/40 to-accent-500/40" />
                <h3 className="text-fg font-black mb-4 text-sm uppercase tracking-widest">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-500 mt-0.5">
                        {spec.icon}
                      </div>
                      <div>
                        <p className="text-fg-subtle text-xs font-bold uppercase tracking-wider">{spec.label}</p>
                        <p className="text-fg font-bold text-sm mt-0.5">{spec.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color option */}
              <div className="mb-6">
                <p className="text-fg-muted text-sm font-bold mb-3 uppercase tracking-wider">Color Option</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['Single Color', 'Multicolor'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setColorMode(mode)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-black transition-all ${
                        colorMode === mode
                          ? 'border-primary-500/50 bg-primary-500/10 text-primary-500'
                          : 'border-surface-border bg-surface-muted/40 text-fg-muted hover:text-fg hover:border-primary-500/30'
                      }`}
                      style={colorMode === mode ? { boxShadow: '0 0 10px rgba(99,102,241,0.2)' } : {}}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {colorMode === 'Single Color' && (
                  <select
                    value={singleColor}
                    onChange={(e) => setSingleColor(e.target.value)}
                    className="w-full bg-surface-muted/60 border border-surface-border rounded-xl px-4 py-3 text-fg text-sm focus:outline-none focus:border-primary-500 backdrop-blur-sm"
                  >
                    {AVAILABLE_COLORS.map((color) => (
                      <option key={color.name} value={color.name}>{color.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="rounded-2xl border border-primary-500/20 bg-surface-card/60 backdrop-blur-sm p-6 relative overflow-hidden"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.08)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500" />
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-fg-subtle text-xs font-bold uppercase tracking-wider mb-1">Price</p>
                  <p className="text-5xl font-black gradient-text">₹{product.price}</p>
                </div>
                {product.inStock && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    In Stock
                  </div>
                )}
              </div>

              <motion.button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                whileHover={product.inStock ? { scale: 1.02 } : {}}
                whileTap={product.inStock ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                  !product.inStock
                    ? 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                    : 'btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                }`}
              >
                {!product.inStock ? (
                  'Out of Stock'
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-surface-border/50">
            <h2 className="text-2xl font-black text-fg mb-8">Other Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => router.push(`/products/${p.slug}`)}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-sm overflow-hidden cursor-pointer group transition-all"
                  style={{ boxShadow: '0 0 0 0 rgba(99,102,241,0)' }}
                >
                  <div className={`w-full aspect-[4/3] relative ${(p.image || p.images?.[0]) ? 'bg-surface-muted' : `bg-gradient-to-br ${p.imageColor}`}`}>
                    {(p.image || p.images?.[0]) ? (
                      <Image
                        src={p.image || p.images?.[0]}
                        alt={p.name}
                        fill
                        className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/20" />
                    )}
                  </div>
                  <div className="p-4 border-t border-surface-border/50">
                    <h3 className="text-fg font-bold text-sm mb-1 group-hover:text-primary-500 transition-colors">{p.name}</h3>
                    <p className="gradient-text font-black">₹{p.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
