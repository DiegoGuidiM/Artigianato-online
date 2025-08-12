class Service {

    service_id;
    name;

    constructor(service_id=null, name) {
        this.service_id = service_id;
        this.name = name;
    }

    get_id() {
        return this.service_id;
    }

    get_name() {
        return this.name;
    }

    set_id(service_id) {
        this.service_id = service_id;
    }

    set_name(name) {
        this.name = name;
    }

}