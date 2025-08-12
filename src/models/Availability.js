class Availability {

    availability_id;
    location;
    space_type;
    date;
    start_time;
    end_time;
    available_seats;

    constructor(availability_id = null, location, space_type, date, start_time, end_time, available_seats) {
        this.availability_id = availability_id;
        this.location = location;
        this.space_type = space_type;
        this.date = date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.available_seats = available_seats;
    }

    get_id() {
        return this.availability_id;
    }

    get_location() {
        return this.location;
    }

    get_space_type() {
        return this.space_type;
    }

    get_date() {
        return this.date;
    }

    get_start_time() {
        return this.start_time;
    }

    get_end_time() {
        return this.end_time;
    }

    get_available_seats() {
        return this.available_seats;
    }

    set_id(availability_id) {
        this.availability_id = availability_id;
    }

    set_location(location) {
        this.location = location;
    }

    set_space_type(space_type) {
        this.space_type = space_type;
    }

    set_date(date) {
        this.date = date;
    }

    set_start_time(start_time) {
        this.start_time = start_time;
    }

    set_end_time(end_time) {
        this.end_time = end_time;
    }

    set_available_seats(available_seats) {
        this.available_seats = available_seats;
    }

}