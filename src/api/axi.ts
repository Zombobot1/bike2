import axios from 'axios';

export const BASE_URL = 'https://uniapi.com';

export const axi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});
