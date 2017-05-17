/**
 * Created by pjworrall on 11/05/2016.
 */

import {Template} from 'meteor/templating';

import './contact.html';

import  {ZidAddressData } from '/imports/startup/client/globals.js';

import { ReactiveVar } from 'meteor/reactive-var';

Template.contact.onCreated(function () {

    this.Contact = new ReactiveVar(ZidAddressData.findOne(this.data._id));

});

Template.contact.helpers({
    name() {
        return Template.instance().Contact.get().contact.name;
    },

    address() {
        return Template.instance().Contact.get().contact.address;
    },
    color() {
        return "grey";
    }
});

Template.contact.events({

    'click .js-action'(event, template) {
        console.log("z/ click .js-action")
        event.preventDefault();

        // remove from the record

        console.log("z/ removing: " + JSON.stringify(template.data._id));

        if (confirm('Are you sure?')){
            ZidAddressData.remove({ _id: template.data._id});
        }

    },

    'click .js-details'(event, template) {

        console.log("z/ click .js-details")
        event.preventDefault();

    }

});
