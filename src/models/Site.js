class Site {

    site_id;
    name;
    address;
    city;
    state;

    constructor(site_id=null, name, address, city, state) {
        this.site_id = site_id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
    }

    get_id() {
        return this.site_id;
    }

    get_name() {
        return this.name;
    }

    get_address() {
        return this.address;
    }

    get_city() {
        return this.city;
    }

    get_state() {
        return this.state;
    }

    set_id(site_id) {
        this.site_id = site_id;
    }

    set_name(name) {
        this.name = name;
    }

    set_address(address) {
        this.address = address;
    }

    set_city(city) {
        this.city = city;
    }

    set_state(state) {
        this.state = state;
    }

}