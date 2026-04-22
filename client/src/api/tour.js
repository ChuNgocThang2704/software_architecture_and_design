import { request } from './request';
import { Tour, Schedule, TourAddon } from '../model';

export async function searchTours(name) {
  const response = await request('GET', `/api/tours?name=${name || ''}`);
  return response.data.map(item => Object.assign(new Tour(), item));
}

export async function getTourSchedules(tourId) {
  const response = await request('GET', `/api/tours/${tourId}/schedules`);
  return response.data.map(item => Object.assign(new Schedule(), item));
}

export async function getTourServices(tourId) {
  const response = await request('GET', `/api/tours/${tourId}/services`);
  return response.data.map(item => Object.assign(new TourAddon(), item));
}
