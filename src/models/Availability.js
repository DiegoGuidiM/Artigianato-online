class Availability {

    availability_id;
    site_id;
    date;
    start_time;
    end_time;
    available_slots;

    constructor(availability_id=null, site_id, date, start_time, end_time, available_slots) {
        this.availability_id = availability_id;
        this.site_id = site_id;
        this.date = date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.available_slots = available_slots;
    }

    get_id() {
        return this.availability_id;
    }

    get_site_id() {
        return this.site_id;
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

    get_available_slots() {
        return this.available_slots;
    }

    set_id(availability_id) {
        this.availability_id = availability_id;
    }

    set_site_id(site_id) {
        this.site_id = site_id;
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

    set_available_slots(available_slots) {
        this.available_slots = available_slots;
    }

}