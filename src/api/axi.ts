import axios from 'axios';

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://bike.maxvas.ru';

export const axi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});
