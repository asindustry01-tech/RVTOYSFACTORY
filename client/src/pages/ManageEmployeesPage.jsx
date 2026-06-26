import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, UserCheck, UserX, KeyRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import api from '../services/api';

function AddEmployeeModal({ onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ employeeId: '', name: '', password: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.name || !form.password) {
      toast.error('ID, Name and Password are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/employees', form);
      toast.success(`Employee ${form.name} created!`);
      queryClient.invalidateQueries(['employees-count']);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-rv-navy border border-rv-border rounded-xl px-4 py-2.5 text-rv-white placeholder-rv-gray/50 text-sm focus:outline-none focus:border-rv-cyan transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rv-navy/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card rounded-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-rv-white font-semibold text-lg">Add New Employee</h3>
          <button onClick={onClose} className="text-rv-gray hover:text-rv-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className={`${inputClass} font-mono uppercase`} placeholder="Employee ID (e.g. RV-002) *" value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value.toUpperCase() }))} />
          <input className={inputClass} placeholder="Full Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input type="password" className={inputClass} placeholder="Password *" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <input className={inputClass} placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <input type="email" className={inputClass} placeholder="Email (optional)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-rv-border text-rv-gray text-sm hover:border-rv-white transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-rv-cyan text-rv-navy font-bold text-sm disabled:opacity-50 glow-cyan">
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ManageEmployeesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['employees-count'],
    queryFn: () => api.get('/employees').then(r => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/employees/${id}/toggle`),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(['employees-count']);
    },
    onError: () => toast.error('Failed to update status'),
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, password }) => api.put(`/employees/${id}/reset-password`, { newPassword: password }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setResetTarget(null);
      setNewPassword('');
    },
    onError: () => toast.error('Failed to reset password'),
  });

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-rv-navy">
        <div className="max-w-4xl mx-auto px-4 py-6">

          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-rv-gray hover:text-rv-cyan transition-colors mb-6 text-sm">
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-rv-white font-bold">Manage Employees</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-rv-cyan text-rv-navy font-bold px-4 py-2 rounded-xl text-sm glow-cyan hover:bg-rv-cyan/90 transition-all"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-rv-blue rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-rv-blue rounded w-1/3" />
                      <div className="h-3 bg-rv-blue rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data?.data?.map((emp) => (
                <motion.div
                  key={emp._id}
                  layout
                  className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${emp.isActive ? 'bg-rv-cyan/20 text-rv-cyan' : 'bg-rv-border text-rv-gray'}`}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-rv-white font-medium text-sm">{emp.name}</p>
                      <p className="text-rv-gray text-xs font-mono">{emp.employeeId}</p>
                      {emp.phone && <p className="text-rv-gray text-xs">{emp.phone}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${emp.isActive ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-red-400 bg-red-400/10 border-red-400/30'}`}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>

                    <button
                      onClick={() => toggleMutation.mutate(emp._id)}
                      className="p-2 rounded-lg border border-rv-border hover:border-rv-cyan text-rv-gray hover:text-rv-cyan transition-all"
                      title={emp.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {emp.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>

                    <button
                      onClick={() => setResetTarget(emp)}
                      className="p-2 rounded-lg border border-rv-border hover:border-yellow-400 text-rv-gray hover:text-yellow-400 transition-all"
                      title="Reset Password"
                    >
                      <KeyRound size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {data?.data?.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-rv-gray">No employees yet. Add your first employee!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rv-navy/80 backdrop-blur-sm" onClick={() => setResetTarget(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-rv-white font-semibold mb-1">Reset Password</h3>
            <p className="text-rv-gray text-sm mb-4">For: {resetTarget.name} ({resetTarget.employeeId})</p>
            <input
              type="password"
              className="w-full bg-rv-navy border border-rv-border rounded-xl px-4 py-2.5 text-rv-white placeholder-rv-gray/50 text-sm focus:outline-none focus:border-rv-cyan transition-all mb-3"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setResetTarget(null)} className="flex-1 py-2.5 rounded-xl border border-rv-border text-rv-gray text-sm">Cancel</button>
              <button
                onClick={() => resetMutation.mutate({ id: resetTarget._id, password: newPassword })}
                disabled={!newPassword || resetMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-rv-navy font-bold text-sm disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
