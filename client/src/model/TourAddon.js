export class TourAddon {
    constructor(id = null, note = '', price = 0, quantity = 1, serviceId = null, tourId = null) {
        this.id = id;
        this.note = note;
        this.price = price;
        this.quantity = quantity;
        this.serviceId = serviceId;
        this.tourId = tourId;
    }
}
