class User {

    user_id;
    name;
    surname;
    email;
    password;
    mobile;
    registration_date;
    role;

    constructor(user_id=null, name, surname, email, password, mobile, registration_date=null, role) {
        this.user_id = user_id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.registration_date = registration_date;
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

    get_mobile() {
        return this.mobile;
    }

    get_registration_date() {
        return this.registration_date;
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

    set_mobile(mobile) {
        this.mobile = mobile;
    }

    set_registration_date(registration_date) {
        this.registration_date = registration_date;
    }

    set_role(role) {
        this.role = role;
    }

}