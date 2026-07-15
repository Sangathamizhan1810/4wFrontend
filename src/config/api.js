const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://fourwbackend.onrender.com'

export default API_BASE_URL
