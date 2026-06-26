import api from './api';

export const getCatalogs = (params) => api.get('/catalog', { params });
export const getCatalogById = (id) => api.get(`/catalog/${id}`);
export const getFeatured = () => api.get('/catalog/featured');
export const createCatalog = (formData) =>
  api.post('/catalog', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCatalog = (id, formData) =>
  api.put(`/catalog/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCatalog = (id) => api.delete(`/catalog/${id}`);
export const deleteCatalogImage = (id, publicId) =>
  api.delete(`/catalog/${id}/image/${publicId}`);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);
export const toggleEmployee = (id) => api.patch(`/employees/${id}/toggle`);
export const resetPassword = (id, newPassword) =>
  api.put(`/employees/${id}/reset-password`, { newPassword });
