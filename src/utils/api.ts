const API_TIMEOUT = 30000; // 30초
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    // Strip any leading slash to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    // Always prepend 'api/' to the URL
    const fullUrl = `${API_BASE_URL}/api/${cleanUrl}`;
    console.log(`Fetching: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      // Network errors like ECONNREFUSED
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to the server. Please check if the backend server is running.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const safeParseJSON = (str: string): any => {
  if (!str) return str;
  
  try {
    return JSON.parse(str);
  } catch (e) {
    try {
      return JSON.parse(str.replace(/'/g, '"'));
    } catch (e2) {
      console.error('JSON parse failed:', e2);
      return str;
    }
  }
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'Request timeout. Please try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}; 