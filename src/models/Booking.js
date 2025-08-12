class Booking {

    booking_id;
    user;
    availability;
    booking_status;
    booking_date;

    constructor(booking_id = null, user, availability, booking_status, booking_date = null) {
        this.booking_id = booking_id;
        this.user = user;
        this.availability = availability;
        this.booking_status = booking_status;
        this.booking_date = booking_date;
    }

    get_id() {
        return this.booking_id;
    }

    get_user() {
        return this.user;
    }

    get_availability() {
        return this.availability;
    }

    get_booking_status() {
        return this.booking_status;
    }

    get_booking_date() {
        return this.booking_date;
    }

    set_id(booking_id) {
        this.booking_id = booking_id;
    }

    set_user(user) {
        this.user = user;
    }

    set_availability(availability) {
        this.availability = availability;
    }

    set_booking_status(booking_status) {
        this.booking_status = booking_status;
    }

    set_booking_date(booking_date) {
        this.booking_date = booking_date;
    }

}