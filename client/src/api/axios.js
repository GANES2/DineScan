import axios from 'axios';

// Otomatis deteksi jika dijalankan di localhost atau IP Jaringan
const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api'
  : `http://${window.location.hostname}:5001/api`;

const api = axios.create({
  baseURL,
});

export default api;
