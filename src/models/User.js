class User {

    user_id;
    name;
    surname;
    email;
    password;
    role;

    constructor(user_id=null, name, surname, email, password, role) {
        this.user_id = user_id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    get_id() {
        return this.user_id;
    }

    get_name() {
        return this.name;
    }

    get_surname() {
        return this.surname;
    }

    get_email() {
        return this.email;
    }

    get_password() {
        return this.password;
    }

    get_role() {
        return this.role;
    }

    set_id(user_id) {
        this.user_id = user_id;
    }

    set_name(name) {
        this.name = name;
    }

    set_surname(surname) {
        this.surname = surname;
    }

    set_email(email) {
        this.email = email;
    }

    set_password(password) {
        this.password = password;
    }

    set_role(role) {
        this.role = role;
    }

}