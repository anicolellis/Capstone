export default {
    name: {required: {value: true, message: 'Please enter your name'}},
    email: {
        required: {value: true, message: 'Please enter your email'},
        pattern: {
            value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Invalid email address',
        },
    },
    password: {
        required: {value: true, message: 'Please enter your password'},
    },
};