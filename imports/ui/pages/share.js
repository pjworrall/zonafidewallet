/**
 * Created by pjworrall on 05/04/2017.
 */

import {Template} from 'meteor/templating';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { ZidUserLocalData, ZoneState } from '/imports/startup/client/globals.js';
import  {i18n} from '/imports/startup/client/lang.js';

import './share.html';

Template.share.onCreated(function () {

    this.ZoneFactory = ZonafideWeb3.getFactory();

    const record = ZidUserLocalData.findOne(
        Template.instance().data._id);

    this.state = record.state;
    this.name = record.name;
    this.address = record.address;

});

Template.share.onRendered(function () {

    $('#qrcode').qrcode({
        render: 'div',
        size: 400,
        text: Template.instance().address
    });

});

Template.share.helpers({

    name() {
        return Template.instance().name;
    },
    address() {
        return Template.instance().address;
    },
    sent() {
        return Template.instance().state;
    }

});

Template.share.events({

    'click .js-share'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: i18n.t("share.js-share.message", {address: template.address}), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("share.js-share.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("share.js-share.url"),
            chooserTitle: i18n.t("share.js-share.title") // Android only, you can override the default share sheet title
        };

        let onSuccess = function (result) {
            console.log("z/ shared: "  + JSON.stringify(result));
            ZidUserLocalData.update({_id: template.data._id}, {$set: {state: ZoneState.WAIT_ON_ACKNOWLEDGER}});
        };

        let onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }
});

