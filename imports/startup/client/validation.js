/**
 * Created by pjworrall on 25/01/2017.
 */

import  {i18n} from '/imports/startup/client/lang.js';

import  { ZidStore} from '/imports/startup/client/globals.js';

// todo: Need to adopt i18n.
// todo: if we have adopted polyglot for internationalization how do we make sure polyglot is instantiated first ?

//** Customer validation methods**/

//**  Checks that an Address is valid hex **/

jQuery.validator.addMethod("address", function(value, element) {

    let reg = /^0x[0-9A-F]{40}$/i;

    return this.optional(element) || reg.test(value) ;

}, jQuery.validator.format("Not a valid Address"));


jQuery.validator.addMethod("owner", function(value, element) {

    let owner = "0x" + ZidStore.get().getAddresses()[0];

    return this.optional(element) || ( owner.toLowerCase() !== value.toLowerCase() ) ;

}, jQuery.validator.format("Cannot be Activity owner"));


/** Global form validation rules */

/* Addresses are used everywhere so this rule set should help */

let AddressRules = {
    rules: {
        required: true,
        minlength: 42,
        maxlength: 42,
        address: true ,
        owner: true },

    messages: {
        required: jQuery.validator.format(i18n.t("validators.address.required")),
        minlength: jQuery.validator.format(i18n.t("validators.address.minlength")),
        maxlength: jQuery.validator.format(i18n.t("validators.address.maxlength")),
        address: jQuery.validator.format(i18n.t("validators.address.address")),
        owner: jQuery.validator.format(i18n.t("validators.address.owner"))
    }
};

/* For the forms elements around Address creation */

let Identities = {
    rules: {
        required: true,
        minlength: 80
    },

    message: {
        required: "You must provide some random characters",
        minlength: "More characters required",
    }
};


export {
    AddressRules,
    Identities
};