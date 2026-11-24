import axios from 'axios';
import { BACKEND_URL } from '../theme/constants';
import { clearAuthTokens, getAuthTokens, setAuthTokens } from '../services/tokenStorage';

const instance = axios.create({
  baseURL: BACKEND_URL, // Change to your backend URL
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [function (data) {
    // If data is FormData, return it as is. Axios will set the correct Content-Type.
    if (data instanceof FormData) {
      return data;
    }
    // Otherwise, use default JSON transformation
    return JSON.stringify(data);
  }],
});

let refreshPromise = null;
let authExpiredHandler = null;

export const setAuthExpiredHandler = (handler) => {
  authExpiredHandler = handler;
};

export const getAccessToken = async () => (await getAuthTokens())?.accessToken || null;

instance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // For FormData, remove the default JSON Content-Type header
    // React Native/axios will automatically set multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const refreshSession = async () => {
  const tokens = await getAuthTokens();
  if (!tokens?.refreshToken) {throw new Error('No refresh token');}
  const response = await axios.post(
    `${BACKEND_URL}/auth/refresh`,
    { refreshToken: tokens.refreshToken },
    { timeout: 20000, headers: { 'Content-Type': 'application/json' } }
  );
  const rotated = {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken || tokens.refreshToken,
  };
  if (!rotated.accessToken) {throw new Error('Refresh response did not include an access token');}
  await setAuthTokens(rotated);
  return rotated.accessToken;
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || !original || original._retry || original.skipAuth) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }
      const accessToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${accessToken}`;
      return instance(original);
    } catch (refreshError) {
      await clearAuthTokens();
      authExpiredHandler?.();
      return Promise.reject(refreshError);
    }
  }
);

export default instance;
