export class Tour {
    constructor(id = null, name = '', destination = '', type = '', time = '', status = '', note = '') {
        this.id = id;
        this.name = name;
        this.destination = destination;
        this.type = type;
        this.time = time;
        this.status = status;
        this.note = note;
    }
}
