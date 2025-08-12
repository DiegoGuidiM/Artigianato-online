class Payment {

    payment_id;
    booking;
    amount;
    payment_date;
    payment_method;
    status;

    constructor(payment_id=null, booking, amount, payment_date=null, payment_method, status) {
        this.payment_id = payment_id;
        this.booking = booking;
        this.amount = amount;
        this.payment_date = payment_date;
        this.payment_method = payment_method;
        this.status = status;
    }

    get_id() {
        return this.payment_id;
    }

    get_booking() {
        return this.booking;
    }

    get_amount() {
        return this.amount;
    }

    get_payment_date() {
        return this.payment_date;
    }

    get_payment_method() {
        return this.payment_method;
    }

    get_status() {
        return this.status;
    }

    set_id(payment_id) {
        this.payment_id = payment_id;
    }

    set_booking(booking) {
        this.booking = booking;
    }

    set_amount(amount) {
        this.amount = amount;
    }

    set_payment_date(payment_date) {
        this.payment_date = payment_date;
    }

    set_payment_method(payment_method) {
        this.payment_method = payment_method;
    }

    set_status(status) {
        this.status = status;
    }

}