class Payment {

    payment_id;
    reservation_id;
    amount;
    payment_method;
    payment_date;

    constructor(payment_id=null, reservation_id, amount, payment_method, payment_date=null) {
        this.payment_id = payment_id;
        this.reservation_id = reservation_id;
        this.amount = amount;
        this.payment_method = payment_method;
        this.payment_date = payment_date;
    }

    get_id() {
        return this.payment_id;
    }

    get_reservation_id() {
        return this.reservation_id;
    }

    get_amount() {
        return this.amount;
    }

    get_payment_method() {
        return this.payment_method;
    }

    get_payment_date() {
        return this.payment_date;
    }

    set_id(payment_id) {
        this.payment_id = payment_id;
    }

    set_reservation_id(reservation_id) {
        this.reservation_id = reservation_id;
    }

    set_amount(amount) {
        this.amount = amount;
    }

    set_payment_method(payment_method) {
        this.payment_method = payment_method;
    }

    set_payment_date(payment_date) {
        this.payment_date = payment_date;
    }

}