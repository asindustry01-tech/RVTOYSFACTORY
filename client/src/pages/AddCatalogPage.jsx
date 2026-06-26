import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import api from '../services/api';

export default function AddCatalogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [bulkPricing, setBulkPricing] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState(['']);

  const [form, setForm] = useState({
    productCode: '',
    name: '',
    description: '',
    category: '',
    basePrice: '',
    moq: 1,
    availability: 'in_stock',
    leadTime: '',
    tags: '',
    isFeatured: false,
    height: '',
    width: '',
    weight: '',
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addBulkTier = () => setBulkPricing(prev => [...prev, { minQty: '', maxQty: '', pricePerUnit: '' }]);
  const removeBulkTier = (i) => setBulkPricing(prev => prev.filter((_, idx) => idx !== i));
  const updateBulkTier = (i, field, value) => {
    setBulkPricing(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const addColor = () => setColors(prev => [...prev, { name: '', hexCode: '#000000' }]);
  const removeColor = (i) => setColors(prev => prev.filter((_, idx) => idx !== i));
  const updateColor = (i, field, value) => {
    setColors(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productCode || !form.name || !form.description || !form.category || !form.basePrice) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach(img => formData.append('images', img));

      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'height' && k !== 'width' && k !== 'weight') formData.append(k, v);
      });

      formData.append('pricing', JSON.stringify({
        basePrice: Number(form.basePrice),
        bulkPricing: bulkPricing.map(t => ({
          minQty: Number(t.minQty),
          maxQty: Number(t.maxQty),
          pricePerUnit: Number(t.pricePerUnit),
        })),
        currency: 'INR',
      }));

      formData.append('dimensions', JSON.stringify({
        height: form.height,
        width: form.width,
        weight: form.weight,
      }));

      formData.append('colors', JSON.stringify(colors.filter(c => c.name)));
      formData.append('materials', JSON.stringify(materials.filter(Boolean)));

      if (form.tags) {
        form.tags.split(',').map(t => t.trim()).forEach(tag => formData.append('tags[]', tag));
      }

      await api.post('/catalog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product added successfully!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-rv-navy border border-rv-border rounded-xl px-4 py-2.5 text-rv-white placeholder-rv-gray/50 text-sm focus:outline-none focus:border-rv-cyan transition-all";
  const labelClass = "block text-rv-gray text-xs font-medium mb-1.5";

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-rv-navy">
        <div className="max-w-3xl mx-auto px-4 py-6">

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-rv-gray hover:text-rv-cyan transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h2 className="font-display text-2xl text-rv-white font-bold mb-6">Add New Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-rv-cyan text-sm font-semibold mb-4 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Product Code *</label>
                  <input
                    className={`${inputClass} font-mono uppercase`}
                    placeholder="RVT-001"
                    value={form.productCode}
                    onChange={e => setForm(f => ({ ...f, productCode: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">Select Category</option>
                    {categoriesData?.data?.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Product Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Velvet Reindeer Plush Toy"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Description *</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Images */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-rv-cyan text-sm font-semibold mb-4 uppercase tracking-wider">Product Images</h3>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-rv-border rounded-xl p-6 cursor-pointer hover:border-rv-cyan transition-all">
                <Upload size={24} className="text-rv-gray mb-2" />
                <span className="text-rv-gray text-sm">Click to upload images</span>
                <span className="text-rv-gray/50 text-xs mt-1">JPG, PNG, WebP — max 5MB each, up to 10</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-rv-border group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} className="text-white" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-rv-cyan text-rv-navy text-xs px-1.5 py-0.5 rounded font-bold">Primary</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-rv-cyan text-sm font-semibold mb-4 uppercase tracking-wider">Pricing & Order</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Base Price (₹) *</label>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="0"
                    value={form.basePrice}
                    onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>MOQ (units)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.moq}
                    onChange={e => setForm(f => ({ ...f, moq: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Lead Time</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 7-10 days"
                    value={form.leadTime}
                    onChange={e => setForm(f => ({ ...f, leadTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + ' mb-0'}>Bulk Pricing Tiers</label>
                  <button type="button" onClick={addBulkTier} className="text-rv-cyan text-xs flex items-center gap-1 hover:text-rv-cyan-light">
                    <Plus size={12} /> Add Tier
                  </button>
                </div>
                {bulkPricing.map((tier, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input type="number" className={inputClass} placeholder="Min Qty" value={tier.minQty} onChange={e => updateBulkTier(i, 'minQty', e.target.value)} />
                    <input type="number" className={inputClass} placeholder="Max Qty" value={tier.maxQty} onChange={e => updateBulkTier(i, 'maxQty', e.target.value)} />
                    <input type="number" className={inputClass} placeholder="Price/Unit" value={tier.pricePerUnit} onChange={e => updateBulkTier(i, 'pricePerUnit', e.target.value)} />
                    <button type="button" onClick={() => removeBulkTier(i)} className="text-red-400 hover:text-red-300 flex items-center justify-center">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-rv-cyan text-sm font-semibold mb-4 uppercase tracking-wider">Product Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Availability</label>
                  <select
                    className={inputClass}
                    value={form.availability}
                    onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.isFeatured}
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-rv-cyan"
                  />
                  <label htmlFor="featured" className="text-rv-gray text-sm cursor-pointer">Mark as Featured</label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className={labelClass}>Height</label>
                  <input className={inputClass} placeholder="e.g. 18 inches" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Width</label>
                  <input className={inputClass} placeholder="e.g. 12 inches" value={form.width} onChange={e => setForm(f => ({ ...f, width: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input className={inputClass} placeholder="e.g. 500g" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Tags (comma separated)</label>
                <input className={inputClass} placeholder="velvet, stuffed, christmas" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>

              {/* Materials */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + ' mb-0'}>Materials</label>
                  <button type="button" onClick={() => setMaterials(p => [...p, ''])} className="text-rv-cyan text-xs flex items-center gap-1">
                    <Plus size={12} /> Add
                  </button>
                </div>
                {materials.map((m, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      className={inputClass}
                      placeholder="e.g. Velvet"
                      value={m}
                      onChange={e => setMaterials(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                    />
                    <button type="button" onClick={() => setMaterials(p => p.filter((_, idx) => idx !== i))} className="text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Colors */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass + ' mb-0'}>Available Colors</label>
                  <button type="button" onClick={addColor} className="text-rv-cyan text-xs flex items-center gap-1">
                    <Plus size={12} /> Add Color
                  </button>
                </div>
                {colors.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input type="color" value={c.hexCode} onChange={e => updateColor(i, 'hexCode', e.target.value)} className="w-10 h-10 rounded-lg border border-rv-border bg-rv-navy cursor-pointer" />
                    <input className={`${inputClass} flex-1`} placeholder="Color name" value={c.name} onChange={e => updateColor(i, 'name', e.target.value)} />
                    <button type="button" onClick={() => removeColor(i)} className="text-red-400"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 py-3 rounded-xl border border-rv-border text-rv-gray hover:border-rv-white hover:text-rv-white transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-rv-cyan hover:bg-rv-cyan/90 disabled:opacity-50 text-rv-navy font-bold transition-all glow-cyan text-sm"
              >
                {loading ? 'Adding Product...' : 'Add to Catalog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
