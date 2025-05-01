const API_TIMEOUT = 30000; // 30초
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
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