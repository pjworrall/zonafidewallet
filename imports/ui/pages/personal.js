/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './personal.html';

Template.personal.onCreated(function () {
    // this should restore from the local store any current details

});

Template.personal.helpers({
    //this is here because we could experiment with a drop down list of Zones
    address() {
        // provides the current data in the store
        return ZidUserLocalPersonalData.findOne();
    }
});

Template.personal.events({

    'submit .save'(event, template) {
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

        sAlert.info(details.firstName + " "
            + details.familyName + ", "
            + details.houseId  + ", "
            + details.streetAddress  + ", "
            + details.postCode  + ", ",
            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Added'});

    },

    'submit .remove'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('personal.events: performing personal remove event');

        const id = event.target._id.value;

        console.log("removing: " + id );

        // get the attributes to confirm the deletion
        const details = ZidUserLocalPersonalData.findOne(id);

        //ZidUserLocalPersonalData.remove({_id: id});

        // emovign everything for now as there should only be one
        ZidUserLocalPersonalData.remove({});

        sAlert.info(details.firstName + " "
            + details.familyName + ", "
            + details.houseId  + ", "
            + details.streetAddress  + ", "
            + details.postCode  + ", ",
            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Removed'});

    }

});

