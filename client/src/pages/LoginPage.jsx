import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'; // ✅ Logo import

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId.trim() || !password) {
      toast.error('Please enter Employee ID and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(employeeId.trim(), password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🦌`);
      navigate(user.role === 'admin' ? '/admin' : '/catalog', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rv-navy flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rv-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rv-blue/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          {/* ✅ Logo Image — RV text ki jagah */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-rv-deep mb-4 border border-rv-border glow-cyan overflow-hidden">
            <img
              src={logo}
              alt="RV Toys Factory"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-rv-white tracking-wider">
            RV TOYS
          </h1>
          <p className="text-rv-cyan text-sm tracking-widest font-mono mt-1">
            F A C T O R Y
          </p>
          <p className="text-rv-gray text-sm mt-3">Employee Catalog Portal</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-rv-white font-semibold text-xl mb-6 text-center">
            Sign In to Continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-rv-gray text-sm font-medium mb-2">
                Employee ID
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rv-gray" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  placeholder="e.g. RV-001"
                  className="w-full bg-rv-navy border border-rv-border rounded-xl pl-10 pr-4 py-3 text-rv-white placeholder-rv-gray/50 font-mono focus:outline-none focus:border-rv-cyan focus:ring-1 focus:ring-rv-cyan transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-rv-gray text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rv-gray" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-rv-navy border border-rv-border rounded-xl pl-10 pr-12 py-3 text-rv-white placeholder-rv-gray/50 focus:outline-none focus:border-rv-cyan focus:ring-1 focus:ring-rv-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rv-gray hover:text-rv-cyan transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rv-cyan hover:bg-rv-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed text-rv-navy font-bold py-3 rounded-xl transition-all glow-cyan mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-rv-navy/30 border-t-rv-navy rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-rv-gray text-xs text-center mt-6">
            Contact admin if you forgot your credentials
          </p>
        </div>

        <p className="text-rv-gray/50 text-xs text-center mt-6">
          © 2024 RV Toys Factory, Maihar (M.P.)
        </p>
      </motion.div>
    </div>
  );
}