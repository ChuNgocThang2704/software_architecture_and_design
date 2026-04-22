import { request } from './request';
import { Ticket, ScheduleTicket } from '../model'
function mapToTicket(data) {
  const ticket = Object.assign(new Ticket(), data);
  if (data.scheduleTickets && Array.isArray(data.scheduleTickets)) {
    ticket.scheduleTickets = data.scheduleTickets.map(st => Object.assign(new ScheduleTicket(), st));
  }
  return ticket;
}

export async function createBooking(ticket) {
  const response = await request('POST', '/api/bookings', ticket);
  return mapToTicket(response.data);
}

export async function getBookingById(ticketId) {
  const response = await request('GET', `/api/bookings/${ticketId}`);
  return mapToTicket(response.data);
}
