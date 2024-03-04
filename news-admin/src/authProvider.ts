// src/authProvider.ts
import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
  login: ({ username, password }) => Promise.reject('Login must be handled separately'),
  logout: () => {
    window.localStorage.removeItem('asgardeo_token');
    return Promise.resolve('/');
  },
  checkAuth: () => window.localStorage.getItem('asgardeo_token') ? Promise.resolve() : Promise.reject(),
  checkError: (error) => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};

export default authProvider; // Ajuste para exportação padrão