/**
 * Created by pjworrall on 21/05/2016.
 */

import {Template} from 'meteor/templating';
//import { QRCode } from 'meteor/steeve:jquery-qrcode';
import  {ZidUserLocalData, ZidStore, ZoneStateAction, ZoneStateSymbol, ZoneStateColor} from '/imports/startup/client/globals.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';

import './details.html';

Template.details.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

    const record = ZidUserLocalData.findOne(
        Template.instance().data._id);

    this.name = record.name;
    this.address = record.address;
    this.state = record.state;

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

    this.members = this.zone.getMembers({
        from: ZidStore.get().getAddresses()[0]
    });

    this.acknowledgers = this.zone.getAcknowledgers({
        from: ZidStore.get().getAddresses()[0]
    });

    this.verifier = this.zone.getVerifier({
        from: ZidStore.get().getAddresses()[0]
    });

});

Template.details.onRendered(function () {

    $('#qrcode').qrcode({
        render: 'div',
        size: 400,
        text: Template.instance().address
    });

});

Template.details.helpers({

    address() {
        return Template.instance().address;
    },
    name() {
        return Template.instance().name;
    },

    details() {
        return Template.instance().details;
    },

    confirmed() {
        return Template.instance().confirmed;
    },

    // todo: this is currently only providing one member for MVP
    members() {

        if (Template.instance().members && Template.instance().members.length >= 1) {
            return Template.instance().members[0];
        } else {
            return "None";
        }

    },

    acknowledgers() {

        if (Template.instance().acknowledgers && Template.instance().acknowledgers.length >= 1) {
            return Template.instance().acknowledgers[0];
        } else {
            return "None";
        }

    },

    verifier() {

        if (Template.instance().verifier) {
            return Template.instance().verifier;
        } else {
            return "N/A";
        }

    },

    action() {
        return ZoneStateAction[Template.instance().state];
    },

    symbol() {
        return ZoneStateSymbol[Template.instance().state];
    },

    color() {
        return ZoneStateColor[Template.instance().state];
    }

});

Template.details.events({

    'click .js-delete'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        if (confirm('Are you sure?')) {

            console.log("removing: " + Template.instance().address);

            //todo: small chance the zone might not exist but decided not to test because it is so unlikely
            //todo: maybe should be data._id not we have it?

            ZidUserLocalData.remove({address: template.address});

            Router.go("list");

        }

    },


    'click .js-share'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: 'Secure a Zone for me. Please Acknowledge ' + template.address, // not supported on some apps (Facebook, Instagram)
            subject: 'Zone Address for my Activity', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            //todo: this should be to the explanation page for verifiers
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        let onSuccess = function (result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        let onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    },
    'click .js-send'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: 'Here is the Zone Address for my planned activity: ' + template.address, // not supported on some apps (Facebook, Instagram)
            subject: 'Zone Address for my Activity', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            //todo: this should be to the explanation page for verifiers
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        let onSuccess = function (result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        let onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }
});

