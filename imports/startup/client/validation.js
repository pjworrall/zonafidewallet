/**
 * Created by pjworrall on 25/01/2017.
 */

/** Global form validation rules */

/* Addresses are used everywhere so this rule set should help */

let AddressRules = {
    rules: {
        required: true,
        minlength: 42,
        maxlength: 42 },

    message: {
        required: "You must enter a recipient Address",
        minlength: "Appears too short for a valid Address",
        maxlength: "Appears to long for a valid Address"
    }
};


export {
    AddressRules
};