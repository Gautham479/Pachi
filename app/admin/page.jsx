"use client";

import { useEffect, useMemo, useState } from 'react';
import { MATERIAL_TYPES, PRODUCT_TYPES } from '@/lib/catalog';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, LogOut, ArrowLeft, Plus, Search, Trash2, CheckCircle, XCircle, Upload, BarChart3, Zap } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  fullDescription: '',
  material: 'PLA',
  price: '',
  image: '',
  imageColor: 'from-[#6366f1] to-[#8b5cf6]',
  type: PRODUCT_TYPES[0],
  dimensions: '',
  weight: '',
  printTime: '',
  inStock: true,
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [additionalImagesByProduct, setAdditionalImagesByProduct] = useState({});
  const [uploadingProductId, setUploadingProductId] = useState('');
  const [deletingImage, setDeletingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/products');
    if (!response.ok) {
      let message = 'Failed to load products.';
      try {
        const data = await response.json();
        if (data?.error) {
          message = data.error;
        }
      } catch {
        const text = await response.text().catch(() => '');
        if (text) {
          message = text.slice(0, 160);
        }
      }
      setError(message);
      setLoading(false);
      return;
    }
    const data = await response.json();
    setProducts(data);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const response = await fetch('/api/admin/orders');
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const inStockCount = useMemo(() => products.filter((product) => product.inStock).length, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (p.name?.toLowerCase() || '').includes(q) || 
             (p.description?.toLowerCase() || '').includes(q) ||
             (p.type?.toLowerCase() || '').includes(q) ||
             (p.material?.toLowerCase() || '').includes(q);
    }).sort((a, b) => {
      let valA, valB;
      if (sortKey === 'createdAt') { valA = new Date(a.createdAt || 0).getTime(); valB = new Date(b.createdAt || 0).getTime(); }
      else if (sortKey === 'name') { valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); }
      else if (sortKey === 'price') { valA = a.price; valB = b.price; }
      else if (sortKey === 'stock') { valA = a.inStock ? 1 : 0; valB = b.inStock ? 1 : 0; }
      else { valA = a.id; valB = b.id; }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, searchQuery, sortKey, sortOrder]);

  const handleBulkDelete = async () => {
    if (!selectedProductIds.length) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products? This action cannot be undone.`)) return;

    setLoading(true);
    for (const id of selectedProductIds) {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    }
    setSelectedProductIds([]);
    await fetchProducts();
  };

  const toggleSelect = (id) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = new FormData();
    payload.set('name', form.name);
    payload.set('slug', form.slug);
    payload.set('description', form.description);
    payload.set('fullDescription', form.fullDescription);
    payload.set('material', form.material);
    payload.set('price', String(Number(form.price)));
    payload.set('type', form.type);
    payload.set('imageColor', form.imageColor);
    payload.set('dimensions', form.dimensions);
    payload.set('weight', form.weight);
    payload.set('printTime', form.printTime);
    payload.set('inStock', String(form.inStock));
    if (imageFile) {
      payload.set('imageFile', imageFile);
    }
    for (const file of imageFiles) {
      payload.append('imageFiles', file);
    }

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      let message = 'Failed to create product.';
      try {
        const data = await response.json();
        if (data?.error) {
          message = data.error;
        }
      } catch {
        const text = await response.text().catch(() => '');
        if (text) {
          message = text.slice(0, 160);
        }
      }
      setError(message);
      setSaving(false);
      return;
    }

    setForm(EMPTY_FORM);
    setImageFile(null);
    setImageFiles([]);
    await fetchProducts();
    setSaving(false);
  };

  const addImagesToProduct = async (productId) => {
    const files = additionalImagesByProduct[productId] || [];
    if (!files.length) return;

    setUploadingProductId(productId);
    setError('');

    const payload = new FormData();
    files.forEach((file) => payload.append('imageFiles', file));

    const response = await fetch(`/api/admin/products/${productId}/images`, {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error || 'Failed to add images.');
      setUploadingProductId('');
      return;
    }

    setAdditionalImagesByProduct((prev) => ({ ...prev, [productId]: [] }));
    await fetchProducts();
    setUploadingProductId('');
  };

  const toggleStock = async (product) => {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !product.inStock }),
    });
    if (response.ok) {
      await fetchProducts();
    }
  };

  const deleteProductImage = async (productId, imageUrl) => {
    if (!window.confirm('Delete this image permanently?')) return;
    setDeletingImage(imageUrl);
    setError('');

    const response = await fetch(`/api/admin/products/${productId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error || 'Failed to delete image.');
    } else {
      await fetchProducts();
    }
    setDeletingImage('');
  };

  const deleteProduct = async (id) => {
    const shouldDelete = window.confirm('Delete this product?');
    if (!shouldDelete) return;

    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      await fetchProducts();
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };


  const inputClass = "w-full rounded-xl border border-surface-border bg-surface-muted/60 px-3 py-2.5 text-fg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all backdrop-blur-sm";

  const statCards = [
    { label: 'Total Products', value: products.length, icon: <Package className="w-5 h-5" />, color: 'from-primary-500/20 to-accent-500/20', border: 'border-primary-500/30' },
    { label: 'In Stock', value: inStockCount, icon: <CheckCircle className="w-5 h-5" />, color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'from-cyan-500/20 to-teal-500/20', border: 'border-cyan-500/30' },
    { label: 'Revenue', value: `₹${orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.totalAmount, 0)}`, icon: <BarChart3 className="w-5 h-5" />, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  ];

  return (
    <main className="min-h-screen bg-surface-bg relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-fg flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-500" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-fg-muted mt-1 text-sm ml-13">
              Products: {products.length} | Orders: {orders.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card/60 backdrop-blur-sm border border-surface-border text-fg text-sm font-bold hover:border-primary-500/40 hover:text-primary-500 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card/60 backdrop-blur-sm border border-surface-border text-fg text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${stat.border} bg-surface-card/60 backdrop-blur-sm p-5 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-fg-subtle text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-fg">{stat.value}</p>
                </div>
                <div className="text-primary-500 opacity-60">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-card/60 backdrop-blur-sm border border-surface-border/60 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'products', label: 'Products Manager', icon: <Package className="w-4 h-4" /> },
            { id: 'orders', label: 'Orders Manager', icon: <ShoppingBag className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'text-white' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="adminTabBg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Add Product Form */}
              <section className="rounded-2xl border border-primary-500/20 bg-surface-card/60 backdrop-blur-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/50 to-accent-500/50" />
                <h2 className="text-xl font-black text-fg mb-5 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary-500" />
                  Add New Product
                </h2>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                  <input className={inputClass} placeholder="Slug (optional)" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
                  <input className={`${inputClass} md:col-span-2`} placeholder="Short description" value={form.description} onChange={(e) => updateField('description', e.target.value)} required />
                  <textarea className={`${inputClass} md:col-span-2 min-h-24 resize-none`} placeholder="Full description" value={form.fullDescription} onChange={(e) => updateField('fullDescription', e.target.value)} required />
                  <select className={inputClass} value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                    {PRODUCT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <select className={inputClass} value={form.material} onChange={(e) => updateField('material', e.target.value)}>
                    {MATERIAL_TYPES.map((material) => <option key={material} value={material}>{material}</option>)}
                  </select>
                  <input className={inputClass} type="number" placeholder="Price" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
                  <div>
                    <label className="block text-xs text-fg-muted font-bold mb-1.5">Primary Product Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-fg-muted font-bold mb-1.5">Additional Images</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className={inputClass} />
                  </div>
                  <input className={inputClass} placeholder="Image gradient classes" value={form.imageColor} onChange={(e) => updateField('imageColor', e.target.value)} />
                  <input className={inputClass} placeholder="Dimensions" value={form.dimensions} onChange={(e) => updateField('dimensions', e.target.value)} />
                  <input className={inputClass} placeholder="Weight" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} />
                  <input className={inputClass} placeholder="Print time" value={form.printTime} onChange={(e) => updateField('printTime', e.target.value)} />
                  <label className="flex items-center gap-2 text-sm text-fg font-bold cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={(e) => updateField('inStock', e.target.checked)} className="w-4 h-4 accent-primary-500" />
                    In stock
                  </label>
                  <div className="md:col-span-2">
                    {error ? <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p> : null}
                    <motion.button
                      disabled={saving}
                      whileHover={!saving ? { scale: 1.02 } : {}}
                      whileTap={!saving ? { scale: 0.98 } : {}}
                      className="btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2.5 rounded-xl font-black disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create Product
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </section>

              {/* Manage Products */}
              <section className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-500/50 to-purple-500/50" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <h2 className="text-xl font-black text-fg">Manage Products</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${inputClass} pl-9 !w-auto min-w-[200px]`}
                      />
                    </div>
                    <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className={`${inputClass} !w-auto`}>
                      <option value="createdAt">Date Added</option>
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock Status</option>
                    </select>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`${inputClass} !w-auto`}>
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>

                {selectedProductIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between"
                  >
                    <span className="text-sm font-bold text-fg">{selectedProductIds.length} products selected</span>
                    <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-black rounded-xl transition-colors border border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                      Delete Selected
                    </button>
                  </motion.div>
                )}

                {error ? <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p> : null}

                {loading ? (
                  <div className="flex items-center gap-3 py-8 justify-center">
                    <motion.div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    <p className="text-fg-muted font-semibold">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-fg-muted text-sm text-center py-8">No products found yet. Create one above.</p>
                ) : filteredProducts.length === 0 ? (
                  <p className="text-fg-muted text-sm text-center py-8">No products match your search.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 border border-surface-border/60 rounded-xl bg-surface-muted/30">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer accent-primary-500"
                      />
                      <span className="text-sm font-black text-fg">Select All</span>
                    </div>

                    {filteredProducts.map((product) => {
                      const productImages = [product.image, ...(product.images || [])].filter(Boolean);
                      const uniqueImages = [...new Set(productImages)];
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                            selectedProductIds.includes(product.id)
                              ? 'border-primary-500/40 bg-primary-500/5'
                              : 'border-surface-border/60 bg-surface-muted/20'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-start gap-4">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(product.id)}
                                onChange={() => toggleSelect(product.id)}
                                className="mt-1 w-4 h-4 cursor-pointer accent-primary-500"
                              />
                              <div>
                                <p className="font-black text-fg">{product.name}</p>
                                <p className="text-sm text-fg-muted">{product.type} | {product.material} | ₹{product.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setAdditionalImagesByProduct((prev) => ({ ...prev, [product.id]: Array.from(e.target.files || []) }))}
                                className={`${inputClass} !py-1.5 !text-xs w-[200px]`}
                              />
                              <button
                                onClick={() => addImagesToProduct(product.id)}
                                disabled={uploadingProductId === product.id || !(additionalImagesByProduct[product.id] || []).length}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-primary-500/15 border border-primary-500/30 text-primary-500 disabled:opacity-50 hover:bg-primary-500/25 transition-colors"
                              >
                                <Upload className="w-3 h-3" />
                                {uploadingProductId === product.id ? 'Uploading...' : 'Add Images'}
                              </button>
                              <button
                                onClick={() => toggleStock(product)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                                  product.inStock
                                    ? 'bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25'
                                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                                }`}
                              >
                                {product.inStock ? <><CheckCircle className="w-3 h-3" /> Mark Out of Stock</> : <><XCircle className="w-3 h-3" /> Mark In Stock</>}
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>

                          {uniqueImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-surface-border/40">
                              {uniqueImages.map(url => (
                                <div key={url} className="relative w-16 h-16 border border-surface-border rounded-xl bg-surface-muted overflow-hidden group">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => deleteProductImage(product.id, url)}
                                    disabled={deletingImage === url}
                                    className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete image"
                                  >
                                    {deletingImage === url ? '...' : <Trash2 className="w-4 h-4 text-red-400" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <section className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/50 to-teal-500/50" />
                <h2 className="text-xl font-black text-fg mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent-500" />
                  Recent Orders
                </h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-surface-border rounded-2xl">
                    <ShoppingBag className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
                    <p className="text-fg-muted font-semibold">No orders received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border border-surface-border/60 rounded-2xl p-5 bg-surface-muted/20 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl ${
                          order.status === 'PAID' ? 'bg-green-500' :
                          order.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />

                        <div className="flex-1 space-y-4 pl-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-lg text-fg">{order.orderId}</p>
                              <p className="text-xs text-fg-muted">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                              order.status === 'PAID' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                              order.status === 'PENDING' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/40 p-4 rounded-xl border border-surface-border/50 text-sm">
                            <div>
                              <p className="text-fg-subtle text-xs uppercase font-black tracking-wider mb-2">Customer</p>
                              <p className="font-black text-fg">{order.customerName}</p>
                              <p className="text-fg-muted text-xs">{order.email}</p>
                              <p className="text-fg-muted text-xs">{order.phone}</p>
                            </div>
                            <div>
                              <p className="text-fg-subtle text-xs uppercase font-black tracking-wider mb-2">Shipping</p>
                              <p className="text-fg-muted text-xs">{order.address}</p>
                              <p className="text-fg-muted text-xs">{order.city}, {order.state} {order.pincode}</p>
                            </div>
                          </div>
                        </div>

                        <div className="md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-surface-border/50 pt-4 md:pt-0 md:pl-6">
                          <div>
                            <p className="text-fg-subtle text-xs uppercase font-black tracking-wider mb-3">Items Included</p>
                            <ul className="space-y-2 text-sm max-h-[140px] overflow-y-auto custom-scrollbar">
                              {order.items?.map(item => (
                                <li key={item.id} className="flex justify-between items-start">
                                  <span className="text-fg font-bold text-xs">{item.fileName}</span>
                                  <span className="text-fg-muted whitespace-nowrap ml-2 text-xs">₹{item.price}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-3 border-t border-surface-border/50 space-y-1.5">
                            <div className="flex justify-between text-xs text-fg-muted">
                              <span>Items Total</span>
                              <span>₹{order.totalAmount - order.deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-xs text-fg-muted">
                              <span>Delivery</span>
                              <span>₹{order.deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black text-primary-500 pt-1 border-t border-surface-border/40">
                              <span>Total Paid</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
