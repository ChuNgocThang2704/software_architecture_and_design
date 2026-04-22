export class ScheduleTicket {
    constructor(id = null, scheduleId = null, quantity = 1, type = '', note = '') {
        this.id = id;
        this.scheduleId = scheduleId;
        this.quantity = quantity;
        this.type = type;
        this.note = note;
    }
}
