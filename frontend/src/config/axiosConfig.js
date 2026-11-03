import axios from 'axios';

// Vite reads this public API address from the root .env file.
const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error('Missing VITE_API_URL in the root .env file');
}

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

// Keep backend terminology internal: user-facing API errors say Category.
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (typeof error.response?.data?.error === 'string') {
      error.response.data.error = error.response.data.error.replace(/\btags?\b/gi, word => {
        const category = word.toLowerCase() === 'tags' ? 'categories' : 'category';
        return word[0] === word[0].toUpperCase()
          ? category[0].toUpperCase() + category.slice(1)
          : category;
      });
    }
    return Promise.reject(error);
  },
);

export { apiUrl, apiClient };
