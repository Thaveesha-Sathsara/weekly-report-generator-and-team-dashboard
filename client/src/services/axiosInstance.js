import axios from 'axios';

const axiosInstance = axios.create({
  // Force Axios to hit the Express server on port 5000
  baseURL: 'http://localhost:5000/api', 
});

// Automatically attach the JWT token to every request if the user is logged in
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;