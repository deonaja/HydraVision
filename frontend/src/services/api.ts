import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
})

// Request interceptor: attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: on 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hv_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
