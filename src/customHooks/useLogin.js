import { useState } from 'react';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/merchant/login', { email, password });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const data = err?.response?.data;
      if (data?.code === 'SIGNUP_INCOMPLETE') {
        const incompleteError = new Error(data.error || 'Please finish creating your account');
        incompleteError.code = 'SIGNUP_INCOMPLETE';
        incompleteError.signupProgress = data.signupProgress;
        throw incompleteError;
      }
      Toast.show({
        type: 'error',
        text1: 'Login error',
        text2: data?.error || 'Login failed',
      });
      throw err;
    }
  };

  return { login, loading, error };
};

export default useLogin;
