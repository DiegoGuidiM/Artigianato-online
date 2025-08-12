class Notification {

    notification_id;
    user;
    message;
    sent_at;
    read_at;
    status;

    constructor(notification_id = null, user, message, sent_at = null, read_at = null, status) {
        this.notification_id = notification_id;
        this.user = user;
        this.message = message;
        this.sent_at = sent_at;
        this.read_at = read_at;
        this.status = status;
    }

    get_id() {
        return this.notification_id;
    }

    get_user() {
        return this.user;
    }

    get_message() {
        return this.message;
    }

    get_sent_at() {
        return this.sent_at;
    }

    get_read_at() {
        return this.read_at;
    }

    get_status() {
        return this.status;
    }

    set_id(notification_id) {
        this.notification_id = notification_id;
    }

    set_user(user) {
        this.user = user;
    }

    set_message(message) {
        this.message = message;
    }

    set_sent_at(sent_at) {
        this.sent_at = sent_at;
    }

    set_read_at(read_at) {
        this.read_at = read_at;
    }

    set_status(status) {
        this.status = status;
    }

}