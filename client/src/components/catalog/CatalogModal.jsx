import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Package, Clock, Layers } from 'lucide-react';

export default function CatalogModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rv-navy/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="glass-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative bg-rv-deep p-4 rounded-tl-2xl rounded-bl-2xl">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-rv-navy/80 flex items-center justify-center text-rv-gray hover:text-rv-white transition-colors md:hidden"
              >
                <X size={16} />
              </button>

              <div className="aspect-square rounded-xl overflow-hidden bg-rv-navy mb-3">
                {product.images?.[activeImg] ? (
                  <img
                    src={product.images[activeImg].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-rv-border" />
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-rv-cyan' : 'border-rv-border'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <span className="text-rv-cyan text-sm font-mono">{product.productCode}</span>
                <button
                  onClick={onClose}
                  className="hidden md:flex w-8 h-8 rounded-full border border-rv-border items-center justify-center text-rv-gray hover:text-rv-white hover:border-rv-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <h2 className="text-rv-white font-bold text-xl mb-1">{product.name}</h2>
              <p className="text-rv-gray text-xs mb-4">{product.category?.name}</p>
              <p className="text-rv-gray text-sm mb-4 flex-grow">{product.description}</p>

              {/* Price */}
              <div className="bg-rv-navy rounded-xl p-3 mb-4">
                <div className="flex items-center gap-1 text-rv-white font-bold text-2xl mb-1">
                  <IndianRupee size={18} className="text-rv-cyan" />
                  {product.pricing?.basePrice?.toLocaleString('en-IN')}
                </div>
                <p className="text-rv-gray text-xs">Base price per unit</p>

                {product.pricing?.bulkPricing?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-rv-border">
                    <p className="text-yellow-400 text-xs font-medium mb-1">Bulk Pricing:</p>
                    {product.pricing.bulkPricing.map((tier, i) => (
                      <div key={i} className="flex justify-between text-xs text-rv-gray">
                        <span>{tier.minQty}–{tier.maxQty} units</span>
                        <span className="text-rv-white">₹{tier.pricePerUnit}/unit</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.moq && (
                  <div className="bg-rv-deep rounded-lg p-2">
                    <Package size={12} className="text-rv-cyan mb-1" />
                    <p className="text-rv-gray text-xs">Min. Order</p>
                    <p className="text-rv-white text-sm font-medium">{product.moq} units</p>
                  </div>
                )}
                {product.leadTime && (
                  <div className="bg-rv-deep rounded-lg p-2">
                    <Clock size={12} className="text-rv-cyan mb-1" />
                    <p className="text-rv-gray text-xs">Lead Time</p>
                    <p className="text-rv-white text-sm font-medium">{product.leadTime}</p>
                  </div>
                )}
              </div>

              {/* Materials */}
              {product.materials?.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 text-rv-gray text-xs mb-2">
                    <Layers size={12} />
                    Materials
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.materials.map((m, i) => (
                      <span key={i} className="text-xs bg-rv-blue/50 text-rv-cyan-light px-2 py-0.5 rounded-full border border-rv-border">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <p className="text-rv-gray text-xs mb-2">Available Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-rv-border"
                          style={{ backgroundColor: c.hexCode }}
                          title={c.name}
                        />
                        <span className="text-rv-gray text-xs">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
