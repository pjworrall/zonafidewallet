/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';


import './personal.html';

Template.personal.onCreated(function () {
    // this should restore from the local store any current details

});

Template.personal.helpers({
    address() {
        return ZidUserLocalPersonalData.findOne();
    }
});

Template.personal.events({

    'submit .form'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const details = {
            firstName: event.target.firstName.value,
            familyName: event.target.familyName.value,
            houseId: event.target.houseId.value,
            streetAddress: event.target.streetAddress.value,
            postCode: event.target.postCode.value
        };

        // todo: maybe needs a try catch
        ZidUserLocalPersonalData.insert(details);

    },

    'click .form #remove'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        // removing everything for now as there should only be one
        ZidUserLocalPersonalData.remove({});

        // I should not have needed this but I could not get reactive var to work in time
        template.find("form").reset();

    }

});

