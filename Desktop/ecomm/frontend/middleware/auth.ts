import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';

export const checkAuth = async (): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return false;
  }

  try {
    const response = await api.get('/users/profile');
    if (response.data.success && response.data.user) {
      useAuthStore.getState().setUser(response.data.user);
      return true;
    }
    return false;
  } catch (error) {
    // Token is invalid, clear auth
    useAuthStore.getState().logout();
    return false;
  }
};
