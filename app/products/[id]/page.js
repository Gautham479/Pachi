"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Articulated Dragon',
    description: 'A fully flexible printed dragon with stunning details.',
    fullDescription: 'This articulated dragon is designed with precision joints that allow for smooth, realistic movement. Perfect for collectors and enthusiasts of fantasy art, this 3D printed marvel combines intricate detailing with functional flexibility.',
    material: 'Silk',
    price: 1599,
    image: '/products/dragon.png',
    imageColor: 'from-[#ff7e5f] to-[#feb47b]',
    type: 'Collectible',
    specs: {
      dimensions: '25cm x 15cm x 10cm',
      weight: '150g',
      printTime: '8-10 hours',
      material: 'Silk PLA'
    }
  },
  {
    id: 'p2',
    name: 'Minimalist Headphone Stand',
    description: 'Sleek geometric design to keep your desk organized.',
    fullDescription: 'A minimalist headphone stand with clean geometric lines. Designed to complement modern desk setups while providing sturdy support for your headphones. Perfect for productivity enthusiasts.',
    material: 'Matte PETG',
    price: 100,
    image: '/products/headphone-stand.png',
    imageColor: 'from-[#2193b0] to-[#6dd5ed]',
    type: 'Desk Accessory',
    specs: {
      dimensions: '20cm x 8cm x 12cm',
      weight: '80g',
      printTime: '4-5 hours',
      material: 'Matte PETG'
    }
  },
  {
    id: 'p3',
    name: 'Topology Planter',
    description: 'Mathematical topological surface designed for indoor plants.',
    fullDescription: 'A mathematically inspired planter with a unique topological surface pattern. The organic, flowing design creates visual interest while providing a functional home for small indoor plants.',
    material: 'Wood-fill PLA',
    price: 2499,
    image: '/products/planter.png',
    imageColor: 'from-[#11998e] to-[#38ef7d]',
    type: 'Home Decor',
    specs: {
      dimensions: '15cm height',
      weight: '120g',
      printTime: '6-7 hours',
      material: 'Wood-fill PLA'
    }
  },
  {
    id: 'p4',
    name: 'Ergonomic Macropad Case',
    description: 'Custom 3D printed case for 9-key mechanical macropads.',
    fullDescription: 'A fully customizable ergonomic case for your 9-key mechanical macropad. Features a contoured design for comfortable palm rest and precision cutouts for all components.',
    material: 'ABS',
    price: 850,
    imageColor: 'from-[#bdc3c7] to-[#2c3e50]',
    type: 'Tech Accessory',
    specs: {
      dimensions: '12cm x 10cm x 5cm',
      weight: '95g',
      printTime: '5-6 hours',
      material: 'ABS'
    }
  },
  {
    id: 'p5',
    name: 'Voronoi Pen Holder',
    description: 'Abstract voronoi patterned desk accessory.',
    fullDescription: 'An artistic desk accessory featuring a beautiful Voronoi pattern. The abstract geometric design creates a stunning visual centerpiece while keeping pens and markers organized.',
    material: 'Resin',
    price: 1200,
    imageColor: 'from-[#8e2de2] to-[#4a00e0]',
    type: 'Home Decor',
    specs: {
      dimensions: '10cm x 10cm x 8cm',
      weight: '110g',
      printTime: '5.5 hours',
      material: 'Resin'
    }
  },
  {
    id: 'p6',
    name: 'Mechanical Gyroscope',
    description: 'Print-in-place moving mechanical toy.',
    fullDescription: 'A fully functional mechanical gyroscope that prints as one assembled piece. Watch it spin with satisfying precision engineering. A perfect desk toy and conversation starter.',
    material: 'PLA',
    price: 550,
    imageColor: 'from-[#f12711] to-[#f5af19]',
    type: 'Toy',
    specs: {
      dimensions: '8cm diameter',
      weight: '70g',
      printTime: '3-4 hours',
      material: 'Standard PLA'
    }
  }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [zoom, setZoom] = useState({ x: 0, y: 0 });
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);

  useEffect(() => {
    const foundProduct = MOCK_PRODUCTS.find((p) => p.id === params.id);
    setProduct(foundProduct);
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addDirectItemToCart({
        fileName: product.name,
        config: { material: product.material, quality: 'Pre-printed', color: 'As shown', strength: 20 },
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
              className="w-full max-w-md h-96 rounded-2xl shadow-2xl relative overflow-hidden cursor-zoom-in bg-surface-muted"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover w-full h-full"
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
            {imageHovered && product.image && (
              <div className="absolute top-0 rounded-2xl shadow-2xl overflow-hidden bg-surface-muted border-2 border-cta pointer-events-none z-50 w-96 h-96"
                style={{ left: 'calc(100% + 1.5rem)' }}
              >
                <Image
                  src={product.image}
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
              </div>

              {/* Specs */}
              <div className="bg-surface-muted rounded-xl p-6 mb-8 border border-surface-border">
                <h3 className="text-fg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-fg-subtle text-sm">Dimensions</p>
                    <p className="text-fg font-medium">{product.specs.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Weight</p>
                    <p className="text-fg font-medium">{product.specs.weight}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Print Time</p>
                    <p className="text-fg font-medium">{product.specs.printTime}</p>
                  </div>
                  <div>
                    <p className="text-fg-subtle text-sm">Material</p>
                    <p className="text-fg font-medium">{product.specs.material}</p>
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div className="mb-8">
                <p className="text-fg-muted text-sm mb-2">Material</p>
                <p className="text-2xl font-bold text-fg">{product.material}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div>
              <div className="mb-6">
                <p className="text-fg-muted text-sm mb-2">Price</p>
                <p className="text-5xl font-bold text-primary-600">₹{product.price}</p>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  addedToCart
                    ? 'bg-surface-muted text-fg border border-primary-500/40'
                    : 'bg-cta hover:opacity-90 text-cta-contrast border border-cta shadow-lg shadow-black/10 dark:shadow-black/40'
                }`}
              >
                {addedToCart ? (
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
        </div>

        {/* Related Products Section */}
        <div className="mt-16 pt-12 border-t border-surface-border">
          <h2 className="text-2xl font-bold text-fg mb-8">Other Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all cursor-pointer group shadow-sm"
                >
                  <div className={`w-full h-40 relative opacity-80 group-hover:opacity-100 transition-opacity ${p.image ? '' : `bg-gradient-to-br ${p.imageColor}`}`}>
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover w-full h-full"
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
