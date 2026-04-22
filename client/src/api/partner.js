import { request } from './request';
import { Partner } from '../model';

export async function createPartner(partner) {
  const response = await request('POST', '/api/partners', partner);
  return Object.assign(new Partner(), response.data);
}
