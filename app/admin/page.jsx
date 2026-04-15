"use client";

import { useEffect, useMemo, useState } from 'react';
import { MATERIAL_TYPES, PRODUCT_TYPES } from '@/lib/catalog';
import Link from 'next/link';

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
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [additionalImagesByProduct, setAdditionalImagesByProduct] = useState({});
  const [uploadingProductId, setUploadingProductId] = useState('');
  const [deletingImage, setDeletingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const inStockCount = useMemo(() => products.filter((product) => product.inStock).length, [products]);

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

  return (
    <main className="min-h-screen bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-fg">Admin Product Manager</h1>
            <p className="text-fg-muted mt-1 text-sm">
              Total: {products.length} products | In stock: {inStockCount}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="px-4 py-2 rounded-lg bg-surface-card border border-surface-border text-fg">
              Back to Homepage
            </Link>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-surface-card border border-surface-border text-fg">
              Logout
            </button>
          </div>
        </div>

        <section className="bg-surface-card border border-surface-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-fg mb-4">Add New Product</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            <input className="input-field" placeholder="Slug (optional)" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
            <input className="input-field md:col-span-2" placeholder="Short description" value={form.description} onChange={(e) => updateField('description', e.target.value)} required />
            <textarea className="input-field md:col-span-2 min-h-24" placeholder="Full description" value={form.fullDescription} onChange={(e) => updateField('fullDescription', e.target.value)} required />
            <select className="input-field" value={form.type} onChange={(e) => updateField('type', e.target.value)}>
              {PRODUCT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="input-field" value={form.material} onChange={(e) => updateField('material', e.target.value)}>
              {MATERIAL_TYPES.map((material) => <option key={material} value={material}>{material}</option>)}
            </select>
            <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
            <div>
              <label className="block text-xs text-fg-muted mb-1">Primary Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted mb-1">Additional Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                className="input-field"
              />
            </div>
            <input className="input-field" placeholder="Image gradient classes" value={form.imageColor} onChange={(e) => updateField('imageColor', e.target.value)} />
            <input className="input-field" placeholder="Dimensions" value={form.dimensions} onChange={(e) => updateField('dimensions', e.target.value)} />
            <input className="input-field" placeholder="Weight" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} />
            <input className="input-field" placeholder="Print time" value={form.printTime} onChange={(e) => updateField('printTime', e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-fg">
              <input type="checkbox" checked={form.inStock} onChange={(e) => updateField('inStock', e.target.checked)} />
              In stock
            </label>
            <div className="md:col-span-2">
              {error ? <p className="text-red-500 text-sm mb-2">{error}</p> : null}
              <button disabled={saving} className="bg-cta text-cta-contrast px-5 py-2.5 rounded-lg font-bold disabled:opacity-60">
                {saving ? 'Saving...' : 'Create Product'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-fg mb-4">Manage Products</h2>
          {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
          {loading ? (
            <p className="text-fg-muted">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-fg-muted text-sm">No products found yet. Create one above.</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const productImages = [product.image, ...(product.images || [])].filter(Boolean);
                const uniqueImages = [...new Set(productImages)];

                return (
                <div key={product.id} className="border border-surface-border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-fg">{product.name}</p>
                      <p className="text-sm text-fg-muted">{product.type} | {product.material} | ₹{product.price}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          setAdditionalImagesByProduct((prev) => ({
                            ...prev,
                            [product.id]: Array.from(e.target.files || []),
                          }))
                        }
                        className="input-field !py-1.5 !text-xs w-[220px]"
                      />
                      <button
                        onClick={() => addImagesToProduct(product.id)}
                        disabled={uploadingProductId === product.id || !(additionalImagesByProduct[product.id] || []).length}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500/15 text-fg disabled:opacity-50"
                      >
                        {uploadingProductId === product.id ? 'Uploading...' : 'Add Images'}
                      </button>
                      <button
                        onClick={() => toggleStock(product)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${product.inStock ? 'bg-green-500/15 text-green-600' : 'bg-amber-500/15 text-amber-600'}`}
                      >
                        {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-500/15 text-red-600">
                        Remove Product
                      </button>
                    </div>
                  </div>

                  {uniqueImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-surface-border/50">
                      {uniqueImages.map(url => (
                        <div key={url} className="relative w-16 h-16 border border-surface-border rounded-lg bg-surface-muted overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => deleteProductImage(product.id, url)} 
                            disabled={deletingImage === url} 
                            className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete image"
                          >
                            {deletingImage === url ? '...' : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )})}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
