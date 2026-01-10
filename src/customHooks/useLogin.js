import { useState } from 'react';
import axios from '../api/axios';
import Toast from 'react-native-toast-message'
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/merchant/login', { email, password });
      setLoading(false);
      return res.data; // { id, restaurant_name, restaurant_logo }
    } catch (err) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Login error',
        text2: err?.response?.data?.error || 'Login failed'
      });
      throw err;
    }
  };

  return { login, loading, error };
};

export default useLogin;
