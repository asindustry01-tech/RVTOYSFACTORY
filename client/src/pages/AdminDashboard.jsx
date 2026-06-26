import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Plus, Eye, LayoutDashboard, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: catalogData } = useQuery({
    queryKey: ['catalog-count'],
    queryFn: () => api.get('/catalog?limit=1').then(r => r.data),
  });

  const { data: employeeData } = useQuery({
    queryKey: ['employees-count'],
    queryFn: () => api.get('/employees').then(r => r.data),
  });

  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: catalogData?.pagination?.totalItems || 0,
      color: 'text-rv-cyan',
      bg: 'bg-rv-cyan/10',
    },
    {
      icon: Users,
      label: 'Total Employees',
      value: employeeData?.data?.length || 0,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      icon: Users,
      label: 'Active Staff',
      value: employeeData?.data?.filter(e => e.isActive)?.length || 0,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ];

  const quickActions = [
    {
      icon: Tag,                              // ✅ Tag icon for category
      label: 'Add Category',
      desc: 'Create product category',
      action: () => navigate('/admin/category/add'),  // ✅ Correct route
      border: 'hover:border-purple-400/50',
      iconColor: 'text-purple-400',
    },
    {
      icon: Plus,
      label: 'Add Product',
      desc: 'Add new product to catalog',
      action: () => navigate('/admin/catalog/add'),
      border: 'hover:border-rv-cyan/50',
      iconColor: 'text-rv-cyan',
    },
    {
      icon: Users,
      label: 'Manage Staff',
      desc: 'Add or manage employees',
      action: () => navigate('/admin/employees'),
      border: 'hover:border-yellow-400/50',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Eye,
      label: 'View Catalog',
      desc: 'Preview catalog as employee',
      action: () => navigate('/catalog'),
      border: 'hover:border-green-400/50',
      iconColor: 'text-green-400',
    },
  ];

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-rv-navy">
        <div className="max-w-6xl mx-auto px-4 py-6">

          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard size={20} className="text-rv-cyan" />
            <h2 className="font-display text-2xl text-rv-white font-bold">Admin Dashboard</h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="text-rv-gray text-sm">{stat.label}</p>
                <p className={`font-bold text-3xl font-display mt-1 ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions — 4 columns */}
          <h3 className="text-rv-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={action.action}
                className={`glass-card rounded-2xl p-6 text-left border border-transparent ${action.border} transition-all group`}
              >
                <action.icon size={24} className={`${action.iconColor} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-rv-white font-semibold mb-1">{action.label}</p>
                <p className="text-rv-gray text-sm">{action.desc}</p>
              </motion.button>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}