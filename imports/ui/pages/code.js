/**
 * Created by pjworrall on 21/05/2016.
 */

import { Template } from 'meteor/templating';
//import { QRCode } from 'meteor/steeve:jquery-qrcode';

import './code.html';

Template.code.onRendered(function () {

    $('#qrcode').qrcode({
        render: 'div',
        size: 400,
        text: Template.instance().data.address
    });

    $('.tooltipped').tooltip();

});

Template.code.events({

    'submit .remove'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        if (confirm('Are you sure?')) {

            const address = event.target.address.value;

            console.log("removing: " + address );

            //todo: small chance the zone might not exist but decided not to test because it is so unlikely

            ZidUserLocalData.remove({address: address});

            Router.go("list");

        }

    },

    // todo: these will all go in a service component....eventually...

    'submit .shareWithAcknowledger'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const address = event.target.address.value;

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
            message: 'Secure a Zone for me. Please Acknowledge ' + address, // not supported on some apps (Facebook, Instagram)
            subject: 'Zone Address for my Activity', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            //todo: this should be to the explanation page for verifiers
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        var onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    },
    'submit .shareWithRecipient'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const address = event.target.address.value;

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
            message: 'Here is the Zone Address for my planned activity: ' + address, // not supported on some apps (Facebook, Instagram)
            subject: 'Zone Address for my Activity', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            //todo: this should be to the explanation page for verifiers
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        var onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }
});

