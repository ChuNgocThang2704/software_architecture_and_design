export class Schedule {
    constructor(id = null, startDate = null, endDate = null, type = '', adultPrice = 0, childPrice = 0, quantity = 0, note = '', tourId = null) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
        this.adultPrice = adultPrice;
        this.childPrice = childPrice;
        this.quantity = quantity;
        this.note = note;
        this.tourId = tourId;
    }
}
