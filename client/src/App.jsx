import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import AdminDashboard from './pages/AdminDashboard';
import AddCategoryPage from './pages/AddCategoryPage';
import AddCatalogPage from './pages/AddCatalogPage';
import AdminCatalogPage from './pages/AdminCatalogPage';
import ManageEmployeesPage from './pages/ManageEmployeesPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-rv-navy flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-rv-border border-t-rv-cyan rounded-full animate-spin mx-auto mb-4" />
        <p className="text-rv-gray text-sm font-mono">Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/catalog" replace />;

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/catalog" element={
              <ProtectedRoute><CatalogPage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/category/add" element={
              <ProtectedRoute adminOnly><AddCategoryPage /></ProtectedRoute>
            } />
            <Route path="/admin/catalog" element={
              <ProtectedRoute adminOnly><AdminCatalogPage /></ProtectedRoute>
            } />
            <Route path="/admin/catalog/add" element={
              <ProtectedRoute adminOnly><AddCatalogPage /></ProtectedRoute>
            } />
            <Route path="/admin/employees" element={
              <ProtectedRoute adminOnly><ManageEmployeesPage /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0D1B3E',
                color: '#F0F4FF',
                border: '1px solid #1E2D50',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#00B4D8', secondary: '#0A0E1A' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#0A0E1A' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}