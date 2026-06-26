import api from './api';

export const loginUser = (employeeId, password) =>
  api.post('/auth/login', { employeeId, password });

export const getMe = () => api.get('/auth/me');

export const changePassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword });
