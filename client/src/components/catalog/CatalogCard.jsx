import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Package, IndianRupee, Star } from 'lucide-react';

const AVAILABILITY_CONFIG = {
  in_stock: { label: 'In Stock', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  made_to_order: { label: 'Made to Order', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
};

export default function CatalogCard({ product, onClick }) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const availability = AVAILABILITY_CONFIG[product.availability] || AVAILABILITY_CONFIG.in_stock;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onClick(product)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-rv-cyan/50 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-rv-deep">
        {primaryImage && !imgError ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-rv-border" />
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400/90 text-rv-navy text-xs font-bold px-2 py-1 rounded-full">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}

        {product.images?.length > 1 && (
          <div className="absolute top-2 right-2 bg-rv-navy/80 text-rv-gray text-xs px-2 py-1 rounded-full font-mono">
            1/{product.images.length}
          </div>
        )}

        <div className="absolute inset-0 bg-rv-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-rv-navy/80 rounded-full p-3 translate-y-4 group-hover:translate-y-0 transition-transform">
            <Eye size={20} className="text-rv-cyan" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-rv-cyan/70 text-xs font-medium">
            {product.category?.icon} {product.category?.name}
          </span>
          <span className="text-rv-gray text-xs font-mono">{product.productCode}</span>
        </div>

        <h3 className="text-rv-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-rv-cyan transition-colors">
          {product.name}
        </h3>

        <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-3 ${availability.color}`}>
          {availability.label}
        </span>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-0.5 text-rv-white font-bold text-lg">
              <IndianRupee size={14} className="text-rv-cyan" />
              {product.pricing?.basePrice?.toLocaleString('en-IN')}
            </div>
            <p className="text-rv-gray text-xs">per unit (MOQ: {product.moq})</p>
          </div>
          {product.pricing?.bulkPricing?.length > 0 && (
            <span className="text-yellow-400 text-xs font-medium">Bulk deals ✓</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
