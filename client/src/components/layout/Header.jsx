import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png'; // ✅ Logo import

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-rv-border px-4 md:px-6">
      <div className="h-full flex items-center justify-between">

        {/* ✅ Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rv-cyan/10 border border-rv-cyan/20 flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="RV Toys Factory Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="hidden md:block">
            <h1 className="font-display text-rv-white text-sm font-bold tracking-wider">
              RV TOYS FACTORY
            </h1>
            <p className="text-rv-gray text-xs">Catalog Portal</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-rv-deep px-4 py-2 rounded-full border border-rv-border">
          <span className="text-rv-gray text-sm">{getGreeting()},</span>
          <span className="text-rv-cyan font-semibold text-sm">{user?.name?.split(' ')[0]}</span>
          {isAdmin && (
            <span className="flex items-center gap-1 bg-rv-gold/20 text-rv-gold text-xs px-2 py-0.5 rounded-full font-medium ml-1">
              <Shield size={10} />
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg border border-rv-border flex items-center justify-center text-rv-gray hover:text-rv-cyan hover:border-rv-cyan transition-all">
            <Bell size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-rv-deep border border-rv-border rounded-lg px-3 py-2 hover:border-rv-cyan transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-rv-blue flex items-center justify-center">
                <User size={14} className="text-rv-cyan" />
              </div>
              <span className="text-rv-white text-sm font-medium hidden sm:block">
                {user?.employeeId}
              </span>
              <ChevronDown size={14} className="text-rv-gray" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-56 glass-card rounded-xl border border-rv-border shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-rv-border">
                  <p className="text-rv-white font-medium text-sm">{user?.name}</p>
                  <p className="text-rv-gray text-xs mt-0.5 font-mono">{user?.employeeId}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-400 hover:bg-red-400/10 rounded-lg px-3 py-2 text-sm transition-all"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}