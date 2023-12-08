import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://roomreservations.azurewebsites.net/', // Your API base URL
  // baseURL: 'http://127.0.0.1:8000/', // Your API base URL

});

const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosInstance;
