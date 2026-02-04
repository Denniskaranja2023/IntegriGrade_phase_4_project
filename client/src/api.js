// Base URL for API calls - uses env variable for local development
// For local dev: set VITE_API_URL in .env file (defaults to local backend)
// For production: Railway URL is configured
const baseUrl = import.meta.env.VITE_API_URL || 'https://integrigradephase4project-production.up.railway.app';

export default baseUrl;

