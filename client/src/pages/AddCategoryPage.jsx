import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import api from '../services/api';

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '📦',
    sortOrder: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/categories', form);
      toast.success(`Category "${form.name}" created successfully!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
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
        <div className="max-w-2xl mx-auto px-4 py-6">

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-rv-gray hover:text-rv-cyan transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h2 className="font-display text-2xl text-rv-white font-bold mb-6">Add New Category</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="glass-card rounded-2xl p-5">
              <label className={labelClass}>Category Name *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Plush Toys, Collectibles, Seasonal"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="glass-card rounded-2xl p-5">
              <label className={labelClass}>Description</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Optional description for this category"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Icon/Emoji</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. 🧸"
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value.slice(0, 2) }))}
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
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
                className="flex-1 py-3 rounded-xl bg-rv-cyan hover:bg-rv-cyan/90 disabled:opacity-50 text-rv-navy font-bold transition-all glow-cyan text-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : (<><Plus size={16} />Create Category</>)}
              </button>
            </div>

            <div className="glass-card rounded-2xl p-5 bg-rv-cyan/5 border-rv-cyan/20">
              <p className="text-rv-gray text-xs font-medium mb-3">Quick Templates:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Plush Toys', icon: '🧸' },
                  { name: 'Collectibles', icon: '⭐' },
                  { name: 'Seasonal', icon: '🎄' },
                  { name: 'Limited Edition', icon: '✨' },
                ].map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, name: cat.name, icon: cat.icon }))}
                    className="text-left p-2 rounded-lg border border-rv-cyan/20 hover:border-rv-cyan/50 hover:bg-rv-cyan/10 transition-all text-xs"
                  >
                    <span className="text-sm mr-1">{cat.icon}</span>
                    <span className="text-rv-gray hover:text-rv-cyan">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}