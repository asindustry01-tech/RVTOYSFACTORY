import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import CatalogCard from '../components/catalog/CatalogCard';
import CatalogModal from '../components/catalog/CatalogModal';
import Header from '../components/layout/Header';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'pricing.basePrice', label: 'Price: Low to High' },
  { value: '-pricing.basePrice', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['catalog', search, selectedCategory, sort, page],
    queryFn: () => api.get('/catalog', {
      params: { search, category: selectedCategory, sort, page, limit: 12 }
    }).then(r => r.data),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('-createdAt');
    setPage(1);
  };

  const hasFilters = search || selectedCategory || sort !== '-createdAt';

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-rv-navy">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="mb-6">
            <h2 className="font-display text-2xl text-rv-white font-bold">Product Catalog</h2>
            <p className="text-rv-gray text-sm mt-1">
              {data?.pagination?.totalItems || 0} products available
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-60">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rv-gray" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products, codes..."
                  className="w-full bg-rv-navy border border-rv-border rounded-xl pl-9 pr-4 py-2.5 text-rv-white placeholder-rv-gray/50 text-sm focus:outline-none focus:border-rv-cyan transition-all"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="bg-rv-navy border border-rv-border rounded-xl px-3 py-2.5 text-rv-white text-sm focus:outline-none focus:border-rv-cyan transition-all min-w-36"
              >
                <option value="">All Categories</option>
                {categoriesData?.data?.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-rv-navy border border-rv-border rounded-xl px-3 py-2.5 text-rv-white text-sm focus:outline-none focus:border-rv-cyan transition-all min-w-40"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300 border border-red-400/30 rounded-xl px-3 py-2.5 transition-all"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-rv-deep" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-rv-blue rounded w-3/4" />
                    <div className="h-3 bg-rv-blue rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <p className="text-red-400">Failed to load catalog. Please refresh.</p>
            </div>
          )}

          {!isLoading && data?.data?.length === 0 && (
            <div className="text-center py-20">
              <PackageOpen size={64} className="text-rv-border mx-auto mb-4" />
              <p className="text-rv-white text-lg font-medium">No products found</p>
              <p className="text-rv-gray text-sm mt-1">Try different search terms or filters</p>
            </div>
          )}

          {!isLoading && data?.data?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {data.data.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CatalogCard product={product} onClick={setSelectedProduct} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {data?.pagination?.total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-rv-border text-rv-gray hover:border-rv-cyan hover:text-rv-cyan disabled:opacity-30 transition-all text-sm"
              >
                Previous
              </button>
              <span className="text-rv-gray text-sm">
                Page {page} of {data.pagination.total}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.total, p + 1))}
                disabled={page === data.pagination.total}
                className="px-4 py-2 rounded-lg border border-rv-border text-rv-gray hover:border-rv-cyan hover:text-rv-cyan disabled:opacity-30 transition-all text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <CatalogModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
