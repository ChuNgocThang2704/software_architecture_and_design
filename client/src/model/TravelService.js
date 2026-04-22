export class TravelService {
    constructor(id = null, name = '', type = '', unit = '', note = '', partnerId = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.unit = unit;
        this.note = note;
        this.partnerId = partnerId;
    }
}
