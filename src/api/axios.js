import axios from 'axios';
import { BACKEND_URL } from '../theme/constants';
const instance = axios.create({
  baseURL: BACKEND_URL, // Change to your backend URL
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
