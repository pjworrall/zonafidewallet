/**
 * Created by pjworrall on 25/01/2017.
 */

// todo: Need to adopt i18n.
// todo: if we have adopted polyglot for internationalization how do we make sure polyglot is instantiated first ?

//** Customer validation methods**/

jQuery.validator.addMethod("hex", function(value, element) {

    let reg = /^0x[0-9A-F]{42}$/i;

    //let reg = /0x5db8d0b3b76cf25e533c299b6a323ecbc3a51424/;

    console.log("validator - value: " + value + ", hex?:  " + reg.test(value) );

    return this.optional(element) || reg.test(value) ;

}, jQuery.validator.format("Not a valid Address"));



/** Global form validation rules */

/* Addresses are used everywhere so this rule set should help */

let AddressRules = {
    rules: {
        required: true,
        minlength: 42,
        maxlength: 42,
        hex: true },

    message: {
        required: "You must enter a recipient Address",
        minlength: "Too short for a valid Address",
        maxlength: "Too long for a valid Address",
        hex: "Not a valid Address"
    }
};


export {
    AddressRules
};