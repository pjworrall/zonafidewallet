/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './personal.html';

Template.personal.onCreated(function () {
    // this should restore from the local store any current details
});

Template.personal.helpers({
    //this is here because we could experiment with a drop down list of Zones
    address() {
        // provides the current data in teh store
    }
});

Template.personal.events({

    'submit .save'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('personal.events: performing personal save event');

        const description = {
            firstName: event.target.firstName.value,
            familyName: event.target.familyName.value,
            reference: event.target.reference.value,
            houseId: event.target.houseId.value,
            streetAddress: event.target.streetAddress.value,
            postCode: event.target.postCode.value
        };

        console.log("personal.events - description: " + JSON.stringify(description) );

    }

});

