class SpaceType {

    space_type_id;
    name;
    description;

    constructor(space_type_id=null, name, description) {
        this.space_type_id = space_type_id;
        this.name = name;
        this.description = description;
    }

    get_id() {
        return this.space_type_id;
    }

    get_name() {
        return this.name;
    }

    get_description() {
        return this.description;
    }

    set_id(space_type_id) {
        this.space_type_id = space_type_id;
    }

    set_name(name) {
        this.name = name;
    }

    set_description(description) {
        this.description = description;
    }

}