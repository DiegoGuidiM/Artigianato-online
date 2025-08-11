class Reservation {

    reservation_id;
    user_id;
    availability_id;
    reservation_date;
    status;

    constructor(reservation_id=null, user_id, availability_id, reservation_date=null, status) {
        this.reservation_id = reservation_id;
        this.user_id = user_id;
        this.availability_id = availability_id;
        this.reservation_date = reservation_date;
        this.status = status;
    }

    get_id() {
        return this.reservation_id;
    }

    get_user_id() {
        return this.user_id;
    }

    get_availability_id() {
        return this.availability_id;
    }

    get_reservation_date() {
        return this.reservation_date;
    }

    get_status() {
        return this.status;
    }

    set_id(reservation_id) {
        this.reservation_id = reservation_id;
    }

    set_user_id(user_id) {
        this.user_id = user_id;
    }

    set_availability_id(availability_id) {
        this.availability_id = availability_id;
    }

    set_reservation_date(reservation_date) {
        this.reservation_date = reservation_date;
    }

    set_status(status) {
        this.status = status;
    }

}