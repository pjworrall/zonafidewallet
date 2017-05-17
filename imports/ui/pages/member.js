/**
 * Created by pjworrall on 13/05/2017.
 */

import {Template} from 'meteor/templating';

import './member.html';

import  {ZidAddressData } from '/imports/startup/client/globals.js';

Template.member.onCreated(function () {

    this.contact = ZidAddressData.findOne(this.data._id);

});

Template.member.helpers({
    name() {
        return Template.instance().data.contact.name;
    },

    address() {
        return Template.instance().data.contact.address;
    },
    color() {
        return "grey";
    }
});

Template.member.events({

    'click .js-pick'(event, template) {

        console.log("z/ click .js-pick");
        event.preventDefault();

        // this was a real pain to figure out how to update content of input form on parent template!!
        Template.parentData().zid.set(template.data.contact.address);

    }

});