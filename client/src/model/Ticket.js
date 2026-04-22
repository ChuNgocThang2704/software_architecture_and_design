import { ScheduleTicket } from './ScheduleTicket';

export class Ticket {
    constructor(id = null, userId = null, customerId = null, datePayment = null, status = 'PENDING', note = '', total = 0, scheduleTickets = []) {
        this.id = id;
        this.userId = userId;
        this.customerId = customerId;
        this.datePayment = datePayment;
        this.status = status;
        this.note = note;
        this.total = total;
        this.scheduleTickets = scheduleTickets;
    }
}
