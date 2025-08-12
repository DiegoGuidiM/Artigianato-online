class Location {

    location_id;
    name;
    address;
    city;
    region;
    country;
    capacity;

    constructor(location_id=null, name, address, city, region, country, capacity) {
        this.location_id = location_id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.region = region;
        this.country = country;
        this.capacity = capacity;
    }

    get_id() {
        return this.location_id;
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
    
    get_region() {
        return this.region;
    }

    get_country() {
        return this.country;
    }

    get_capacity() {
        return this.capacity;
    }

    set_id(location_id) {
        this.location_id = location_id;
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

    set_region(region) {
        this.region = region;
    }

    set_country(country) {
        this.country = country;
    }

    set_capacity(capacity) {
        this.capacity = capacity;
    }

}