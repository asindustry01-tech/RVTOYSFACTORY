import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rv-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-rv-cyan text-8xl font-bold mb-4">404</p>
        <h1 className="text-rv-white text-2xl font-semibold mb-2">Page Not Found</h1>
        <p className="text-rv-gray mb-8">This page doesn't exist in our catalog.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 bg-rv-cyan text-rv-navy font-bold px-6 py-3 rounded-xl mx-auto glow-cyan hover:bg-rv-cyan/90 transition-all"
        >
          <Home size={16} />
          Go to Catalog
        </button>
      </motion.div>
    </div>
  );
}
