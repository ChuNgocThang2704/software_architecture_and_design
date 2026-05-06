import { request } from './request';
import { User } from '../model';

export async function login(user) {
  const response = await request('POST', '/api/users/login', user);
  return Object.assign(new User(), response.data);
}

export async function register(user) {
  const response = await request('POST', '/api/users/register', user);
  return Object.assign(new User(), response.data);
}
