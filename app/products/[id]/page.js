"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
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

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        setProduct(null);
        return;
      }
      const data = await response.json();
      setProduct(data);
      const images = getProductImages(data);
      setSelectedImage(images[0] || '');

      const productsResponse = await fetch('/api/products?includeOutOfStock=1');
      const allProducts = await productsResponse.json().catch(() => []);
      if (Array.isArray(allProducts)) {
        setRelatedProducts(allProducts.filter((item) => item.slug !== data.slug).slice(0, 3));
      }
    };

    if (params.id) {
      loadProduct();
    }
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
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoom({ x, y });
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-surface-bg">
        <Navbar />
        <CartDrawer />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-fg-muted">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-bg">
      <Navbar />
      <CartDrawer />
      
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-fg-muted hover:text-fg transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image with Zoom Preview */}
          <div className="flex items-center justify-center relative overflow-visible">
            <div 
              onMouseEnter={() => setImageHovered(true)}
              onMouseLeave={() => {
                setImageHovered(false);
                setZoom({ x: 0, y: 0 });
              }}
              onMouseMove={handleImageMouseMove}
              className="w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl relative overflow-hidden cursor-zoom-in bg-surface-muted"
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain w-full h-full p-3"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/70 font-medium tracking-widest uppercase text-lg drop-shadow-lg">
                      3D Model Preview
                    </span>
                  </div>
                </>
              )}
              
              {!imageHovered && (
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <span className="text-white/60 text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
                    Hover to zoom
                  </span>
                </div>
              )}
            </div>

            {/* Zoom Preview Panel - Larger and Better Aligned */}
            {imageHovered && selectedImage && (
              <div className="absolute top-0 rounded-2xl shadow-2xl overflow-hidden bg-surface-muted border-2 border-cta pointer-events-none z-50 w-96 h-96"
                style={{ left: 'calc(100% + 1.5rem)' }}
              >
                <Image
                  src={selectedImage}
                  alt={`${product.name} zoomed`}
                  fill
                  className="object-cover w-full h-full"
                  style={{
                    transform: 'scale(2.5)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transition: 'transform 0.05s ease-out'
                  }}
                  sizes="384px"
                />
                {/* Zoom level indicator */}
                <div className="absolute top-4 right-4 bg-surface-card/95 text-fg text-sm font-bold px-4 py-2 rounded-full border-2 border-cta shadow-lg">
                  2.5x
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-surface-muted text-primary-600 rounded-full text-sm font-medium border border-surface-border">
                    {product.type}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-fg mb-3">{product.name}</h1>
                <p className="text-fg-muted text-lg mb-6">{product.fullDescription}</p>
                {!product.inStock && (
                  <p className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/15 text-amber-600 border border-amber-500/30">
                    Currently out of stock
                  </p>
                )}
              </div>

              {/* Specs */}
              <div className="bg-surface-muted rounded-xl p-6 mb-8 border border-surface-border">
                <h3 className="text-fg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-fg-subtle text-sm">Dimensions</p>
                    <p className="text-fg font-medium">{product.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Weight</p>
                    <p className="text-fg font-medium">{product.weight}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Print Time</p>
                    <p className="text-fg font-medium">{product.printTime}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Material</p>
                    <p className="text-fg font-medium">{product.material}</p>
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div className="mb-8">
                <p className="text-fg-muted text-sm mb-2">Material</p>
                <p className="text-2xl font-bold text-fg">{product.material}</p>
              </div>

              {/* Color Option */}
              <div className="mb-8">
                <p className="text-fg-muted text-sm mb-3">Color Option</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setColorMode('Single Color')}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      colorMode === 'Single Color'
                        ? 'border-primary-500 bg-primary-500/10 text-fg'
                        : 'border-surface-border bg-surface-muted text-fg-muted hover:text-fg'
                    }`}
                  >
                    Single Color
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('Multicolor')}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      colorMode === 'Multicolor'
                        ? 'border-primary-500 bg-primary-500/10 text-fg'
                        : 'border-surface-border bg-surface-muted text-fg-muted hover:text-fg'
                    }`}
                  >
                    Multicolor
                  </button>
                </div>

                {colorMode === 'Single Color' && (
                  <select
                    value={singleColor}
                    onChange={(e) => setSingleColor(e.target.value)}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-fg text-sm"
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

            {/* Price & Action */}
            <div>
              <div className="mb-6">
                <p className="text-fg-muted text-sm mb-2">Price</p>
                <p className="text-5xl font-bold text-primary-600">₹{product.price}</p>
              </div>

              <button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  !product.inStock
                    ? 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed'
                    :
                  addedToCart
                    ? 'bg-surface-muted text-fg border border-primary-500/40'
                    : 'bg-cta hover:opacity-90 text-cta-contrast border border-cta shadow-lg shadow-black/10 dark:shadow-black/40'
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
              </button>
            </div>
          </div>

          {getProductImages(product).length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {getProductImages(product).map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className={`w-16 h-16 rounded-lg border overflow-hidden relative ${
                    selectedImage === imageUrl ? 'border-primary-500' : 'border-surface-border'
                  }`}
                >
                  <Image src={imageUrl} alt="Product thumbnail" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div className="mt-16 pt-12 border-t border-surface-border">
          <h2 className="text-2xl font-bold text-fg mb-8">Other Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/products/${p.slug}`)}
                  className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all cursor-pointer group shadow-sm"
                >
                  <div className={`w-full aspect-[4/3] relative opacity-80 group-hover:opacity-100 transition-opacity ${(p.image || p.images?.[0]) ? 'bg-surface-muted' : `bg-gradient-to-br ${p.imageColor}`}`}>
                    {(p.image || p.images?.[0]) ? (
                      <Image
                        src={p.image || p.images?.[0]}
                        alt={p.name}
                        fill
                        className="object-contain w-full h-full p-2"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/20" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-fg font-medium text-sm mb-1">{p.name}</h3>
                    <p className="text-primary-600 font-bold">₹{p.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
