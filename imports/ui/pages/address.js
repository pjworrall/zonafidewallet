/**
 * Created by pjworrall on 22/01/2017.
 */

import {Template} from 'meteor/templating';

import  {ZidStore} from '/imports/startup/client/globals.js';

import  {i18n} from '/imports/startup/client/lang.js';

import './address.html';

Template.address.helpers({

    zid() {
        return "0x" + ZidStore.get().getAddresses()[0];
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
            text: '0x' + ZidStore.get().getAddresses()[0]
        });

    }

});

Template.address.events({

    'click .js-share'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {

            message: i18n.t("address.js-share.message",{ address: ("0x" + ZidStore.get().getAddresses()[0] ) } ), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("address.js-share.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("address.js-share.url"),
            chooserTitle: i18n.t("social.share.title") // Android only, you can override the default share sheet title

        };

        // todo: tidy up!
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