import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.2:5001/api', // Menggunakan IP Lokal agar bisa diakses HP
});

export default api;
