/**
 * Created by pjworrall on 22/01/2017.
 */

import {Template} from 'meteor/templating';

import  {ZidStore} from '/imports/startup/client/globals.js';

import './address.html';

Template.address.helpers({

    zid() {
        return ZidStore.get().getAddresses()[0];
    }

});

Template.address.onRendered( function() {
    // this seems inconsistent with Meteor idiom

    // todo: adding the 0x prefix here is a workaround
    // until we understand what we are going to do with addresses

    if(ZidStore.get().getAddresses()[0]) {

        $('#qrcode').qrcode({
            render: 'div',
            size: 400,
            text: '0x' + Session.get('zid')
        });

    }

});

Template.address.events({

    'click .js-share'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this will all go in a service component....eventually...

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: 'Get in the Zone with me. My Zonafide ID is ' + ZidStore.get().getAddresses()[0], // not supported on some apps (Facebook, Instagram)
            subject: 'My Zonafide ID', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        let onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        let onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }


});