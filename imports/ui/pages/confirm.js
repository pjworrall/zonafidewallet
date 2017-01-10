/**
 * Created by pjworrall on 03/05/2016.
 */


import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './confirm.html';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZidUserLocalData, ZidStore} from '/imports/startup/client/globals.js';

Template.confirm.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

    const record = ZidUserLocalData.findOne(
        Template.instance().data._id);

    this.name = record.name;

    // todo: and if we don't get a contract back from the call?
    this.zone = this.ZoneFactory.at(record.address);

    this.status = this.zone.isActive({
        from: ZidStore.get().getAddresses()[0]
    });

    this.confirmed = this.zone.isConfirmed({
        from: ZidStore.get().getAddresses()[0]
    });

    this.details = this.zone.whatIsActive({
        from: ZidStore.get().getAddresses()[0]
    });

    // todo: this should be a privileged method call if that is possible
    //this.serviceProvider = this.zone.serviceProvider;
    this.serviceProvider = false;


});

Template.confirm.helpers({

    name() {
        return Template.instance().name;
    },

    status() {
        return Template.instance().status;
    },

    details() {
        return JSON.stringify(Template.instance().details);
    },

    confirmed() {
        return Template.instance().confirmed;
    },

    serviceProvider() {
        return Template.instance().serviceProvider;
    }

});

Template.confirm.events({

    'click .js-refresh'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-refresh');

    }

});