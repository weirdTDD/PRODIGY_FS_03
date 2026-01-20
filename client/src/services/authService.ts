import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.get('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  updateDetails: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/updatedetails', data);
    return response.data.data;
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AuthResponse> => {
    const response = await api.put('/auth/updatepassword', data);
    return response.data;
  },

  addAddress: async (address: any): Promise<User> => {
    const response = await api.post('/auth/addresses', address);
    return response.data.data;
  },

  updateAddress: async (addressId: string, address: any): Promise<User> => {
    const response = await api.put(`/auth/addresses/${addressId}`, address);
    return response.data.data;
  },

  deleteAddress: async (addressId: string): Promise<User> => {
    const response = await api.delete(`/auth/addresses/${addressId}`);
    return response.data.data;
  }
};
