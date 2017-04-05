/**
 * Created by pjworrall on 05/04/2017.
 */

import {Template} from 'meteor/templating';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { ZidUserLocalData, ZoneState } from '/imports/startup/client/globals.js';
import  {i18n} from '/imports/startup/client/lang.js';

import './send.html';

Template.send.onCreated(function () {

    this.ZoneFactory = ZonafideWeb3.getFactory();

    const record = ZidUserLocalData.findOne(
        Template.instance().data._id);

    this.state = record.state;
    this.name = record.name;
    this.address = record.address;

});

Template.send.onRendered(function () {

    $('#qrcode').qrcode({
        render: 'div',
        size: 400,
        text: Template.instance().address
    });

});

Template.send.helpers({

    name() {
        return Template.instance().name;
    },
    address() {
        return Template.instance().address;
    },
    sent() {
        return Template.instance().state === ZoneState.WAIT_ON_CONFIRM;
    }

});

Template.send.events({

    'click .js-send'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: i18n.t("send.js-send.message", {address: template.address}), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("send.js-send.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("send.js-send.url"),
            chooserTitle: i18n.t("send.js-send.title") // Android only, you can override the default share sheet title
        };

        let onSuccess = function (result) {
            console.log("z/ sent: "  + JSON.stringify(result));
            ZidUserLocalData.update({_id: template.data._id}, {$set: {state: ZoneState.WAIT_ON_CONFIRM}});
        };

        let onError = function (msg) {
            console.log("Sending failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }
});

