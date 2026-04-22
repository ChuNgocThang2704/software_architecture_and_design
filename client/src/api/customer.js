import { request } from './request';
import { Customer } from '../model';

export async function searchCustomers(name) {
  const response = await request('GET', `/api/customers?name=${name || ''}`);
  return response.data.map(item => Object.assign(new Customer(), item));
}

export async function createCustomer(customer) {
  const response = await request('POST', '/api/customers', customer);
  return Object.assign(new Customer(), response.data);
}
