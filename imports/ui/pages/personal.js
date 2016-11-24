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

    'click #save'(event,template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("saving personal details");

        const firstName = $(template.find('input[name=firstName]')).val();
        const familyName = $(template.find('input[name=familyName]')).val();
        const houseId = $(template.find('input[name=houseId]')).val();
        const streetAddress = $(template.find('input[name=streetAddress]')).val();
        const postCode = $(template.find('input[name=postCode]')).val();

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

    'click #remove'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("removing personal details");

        // removing everything for now as there should only be one
        ZidUserLocalPersonalData.remove({});

        // I should not have needed this but I could not get reactive var to work in time
        template.find("form").reset();

    }

});

