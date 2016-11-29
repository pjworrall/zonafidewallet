/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './personal.html';

import  { ZidUserLocalPersonalData } from '/imports/startup/client/globals.js';

Template.personal.onCreated(function () {
    // this should restore from the local store any current details

});

Template.personal.helpers({
    address() {
        return ZidUserLocalPersonalData.findOne();
    }
});

Template.personal.events({

    'click .js-save'(event,template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("saving personal details");

        const firstName = template.$('input[name=firstName]').val();
        const familyName = template.$('input[name=familyName]').val();
        const houseId = template.$('input[name=houseId]').val();
        const streetAddress = template.$('input[name=streetAddress]').val();
        const postCode = template.$('input[name=postCode]').val();

        const details = {
            firstName: firstName,
            familyName: familyName,
            houseId: houseId,
            streetAddress: streetAddress,
            postCode: postCode
        };

        // todo: maybe needs a try catch
        ZidUserLocalPersonalData.insert(details);

    },

    'click .js-remove'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("removing personal details");

        // removing everything for now as there should only be one
        ZidUserLocalPersonalData.remove({});

        // I should not have needed this but I could not get reactive var to work in time
        template.find("form").reset();

    }

});

