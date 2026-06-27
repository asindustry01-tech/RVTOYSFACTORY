import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import api from '../services/api';

export default function AdminCatalogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-catalog'],
    queryFn: () => api.get('/catalog?limit=100').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/catalog/${id}`),
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries(['admin-catalog']);
      setSelectedProduct(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const nextImage = (productId, totalImages) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId, totalImages) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-rv-navy">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-rv-gray hover:text-rv-cyan transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="mb-6">
            <h2 className="font-display text-2xl text-rv-white font-bold">Manage Products</h2>
            <p className="text-rv-gray text-sm mt-1">
              {data?.pagination?.totalItems || 0} products total
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-rv-gray">Loading products...</p>
            </div>
          ) : !data?.data?.length ? (
            <div className="text-center py-20">
              <Package size={64} className="text-rv-border mx-auto mb-4" />
              <p className="text-rv-white text-lg">No products yet</p>
              <p className="text-rv-gray text-sm mt-1">
                <button
                  onClick={() => navigate('/admin/catalog/add')}
                  className="text-rv-cyan hover:underline"
                >
                  Add your first product
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.data.map((product) => {
                const imgIndex = activeImageIndex[product._id] || 0;
                const currentImage = product.images?.[imgIndex];

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl overflow-hidden hover:border-rv-cyan/50 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

                      {/* Images Section — Side */}
                      <div className="relative bg-rv-deep rounded-xl overflow-hidden aspect-square">
                        {currentImage ? (
                          <>
                            <img
                              src={currentImage.url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Image Navigation */}
                            {product.images?.length > 1 && (
                              <>
                                <button
                                  onClick={() => prevImage(product._id, product.images.length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-rv-navy/80 hover:bg-rv-navy text-rv-cyan p-1 rounded-full transition-all"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button
                                  onClick={() => nextImage(product._id, product.images.length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rv-navy/80 hover:bg-rv-navy text-rv-cyan p-1 rounded-full transition-all"
                                >
                                  <ChevronRight size={16} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-rv-navy/80 text-rv-gray text-xs px-2 py-1 rounded-full font-mono">
                                  {imgIndex + 1}/{product.images.length}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-rv-border" />
                          </div>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-rv-cyan/70 text-xs font-medium">
                              {product.category?.icon} {product.category?.name}
                            </span>
                            <span className="text-rv-gray text-xs font-mono">{product.productCode}</span>
                          </div>

                          <h3 className="text-rv-white font-bold text-lg mb-2">{product.name}</h3>

                          <p className="text-rv-gray text-sm line-clamp-2 mb-3">{product.description}</p>

                          <div className={`inline-block text-xs px-2 py-1 rounded-full border font-medium mb-3 ${
                            product.availability === 'in_stock' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
                            product.availability === 'made_to_order' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                            'text-red-400 bg-red-400/10 border-red-400/30'
                          }`}>
                            {product.availability === 'in_stock' ? 'In Stock' :
                             product.availability === 'made_to_order' ? 'Made to Order' :
                             'Out of Stock'}
                          </div>
                        </div>

                        <div>
                          <p className="text-rv-gray text-xs mb-1">Base Price</p>
                          <p className="text-rv-white font-bold text-xl">
                            ₹{product.pricing?.basePrice?.toLocaleString('en-IN')}
                          </p>
                          <p className="text-rv-gray text-xs">MOQ: {product.moq} units</p>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex flex-col gap-3 justify-center">
                        <button
                          onClick={() => navigate(`/admin/catalog/edit/${product._id}`)}
                          className="flex items-center justify-center gap-2 bg-rv-cyan hover:bg-rv-cyan/90 disabled:opacity-50 text-rv-navy font-bold py-2 rounded-xl transition-all glow-cyan"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>

                        {product.images?.length > 0 && (
                          <div className="text-center text-rv-gray text-xs pt-2 border-t border-rv-border">
                            {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}