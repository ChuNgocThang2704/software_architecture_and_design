export class Partner {
    constructor(id = null, name = '', company = '', phone = '', email = '', signDate = null, expirationDate = null) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.phone = phone;
        this.email = email;
        this.signDate = signDate;
        this.expirationDate = expirationDate;
    }
}
