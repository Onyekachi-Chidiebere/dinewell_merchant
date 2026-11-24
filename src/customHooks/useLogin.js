import { useState } from 'react';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';
import { setAuthTokens, setSignupToken } from '../services/tokenStorage';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/merchant/login', { email, password }, { skipAuth: true });
      const { accessToken, refreshToken, ...profile } = res.data;
      if (!accessToken || !refreshToken) {
        throw new Error('Login response did not include session tokens');
      }
      await setAuthTokens({ accessToken, refreshToken });
      setLoading(false);
      return profile;
    } catch (err) {
      setLoading(false);
      const data = err?.response?.data;
      if (data?.code === 'SIGNUP_INCOMPLETE') {
        if (data.signupToken) {await setSignupToken(data.signupToken);}
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
