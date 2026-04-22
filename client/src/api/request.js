import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function request(method = 'GET', url, data) {
  return apiClient.request({ method, url, data });
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}
