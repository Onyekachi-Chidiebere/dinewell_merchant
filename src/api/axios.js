import axios from 'axios';
import { BACKEND_URL } from '../theme/constants';

const instance = axios.create({
  baseURL: BACKEND_URL, // Change to your backend URL
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [function (data, headers) {
    // If data is FormData, return it as is. Axios will set the correct Content-Type.
    if (data instanceof FormData) {
      return data;
    }
    // Otherwise, use default JSON transformation
    return JSON.stringify(data);
  }],
});

instance.interceptors.request.use(
  (config) => {
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

export default instance;
