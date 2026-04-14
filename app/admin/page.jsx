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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const response = await fetch('/api/admin/products');
    if (!response.ok) {
      setError('Failed to load products.');
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

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Failed to create product.');
      setSaving(false);
      return;
    }

    setForm(EMPTY_FORM);
    setImageFile(null);
    await fetchProducts();
    setSaving(false);
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
              <label className="block text-xs text-fg-muted mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
          {loading ? (
            <p className="text-fg-muted">Loading products...</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="border border-surface-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-fg">{product.name}</p>
                    <p className="text-sm text-fg-muted">{product.type} | {product.material} | ₹{product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStock(product)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${product.inStock ? 'bg-green-500/15 text-green-600' : 'bg-amber-500/15 text-amber-600'}`}
                    >
                      {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-500/15 text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
