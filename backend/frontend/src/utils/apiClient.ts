/**
 * API Client utility
 * Centralized function to get the base API URL from environment variables
 */

export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
};

export const API_URL = getApiUrl();
