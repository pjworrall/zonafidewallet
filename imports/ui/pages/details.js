/**
 * Created by pjworrall on 21/05/2016.
 */

import {Template} from 'meteor/templating';
//import { QRCode } from 'meteor/steeve:jquery-qrcode';
import  {
    ZidUserLocalData,
    ZidStore,
    ZoneStateAttributes
} from '/imports/startup/client/globals.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {i18n} from '/imports/startup/client/lang.js';
//import { ZonafideMonitor } from '/imports/startup/client/monitor.js';

import { ReactiveVar } from 'meteor/reactive-var';

import './details.html';

Template.details.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

    const record = ZidUserLocalData.findOne(
        Template.instance().data._id);

    this.name = record.name;
    this.address = record.address;
    this.state = record.state;

    // todo: this needs to be broken down to evaluate the object and present the properties properly
    this.sfDescription = JSON.stringify(record.description);

    // todo: and if we don't get a contract back from the call?
    this.zone = this.ZoneFactory.at(record.address);

    this.status = this.zone.isActive({
        from: ZidStore.get().getAddresses()[0]
    });

    this.confirmed = this.zone.isConfirmed({
        from: ZidStore.get().getAddresses()[0]
    });

    this.hash = this.zone.whatIsActive({
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

    let chal = this.zone.getChallenge({
        from: ZidStore.get().getAddresses()[0]
    });

    console.log("z/details onCreate zone.getChallenge(): " +  chal);

    this.challenge = new ReactiveVar(chal);

    this.hashCheck = ( ZonafideWeb3.getInstance().sha3(this.sfDescription) === this.hash );

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
    hash() {
        return Template.instance().hash;
    },
    description() {
        return Template.instance().sfDescription;
    },
    hashCheck() {
        return Template.instance().hashCheck;
    },
    confirmed() {
        return Template.instance().confirmed;
    },
    challenge() {
        return Template.instance().challenge.get();
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
        return ZoneStateAttributes[Template.instance().state].action;
    },

    symbol() {
        return ZoneStateAttributes[Template.instance().state].symbol;
    },

    color() {
        return ZoneStateAttributes[Template.instance().state].color;
    }

});

Template.details.events({

    'click .js-delete'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        if (confirm('Are you sure?')) {

            console.log("removing: " + Template.instance().address);

            let busyQ = Session.get('busy');
            Session.set('busy', (busyQ + 1));

            template.zone.kill(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),

                function (error, tranHash) {
                    if (error) {
                        sAlert.error('Report error: ' + error,
                            {
                                timeout: 'none',
                                sAlertIcon: 'fa fa-exclamation-circle',
                                sAlertTitle: 'Network Access Failure'
                            });

                        Session.set('busy', Session.get('busy') - 1);

                    } else {

                        sAlert.info('A request to delete the Activity has been made: ' + tranHash,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Deletion Requested'});

                        ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                            if (error) {
                                sAlert.info('Could not delete the Activity: ' + error.toString(),
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Failed to delete the Activity'
                                    });

                                Session.set('busy', Session.get('busy') - 1);

                            } else {
                                //todo: small chance the zone might not exist but decided not to test because it is so unlikely
                                //todo: maybe should be data._id not we have it?

                                ZidUserLocalData.remove({address: template.address});

                                sAlert.info('Activity deleted at block: ' + receipt.blockNumber,
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Activity deleted'
                                    });

                                Session.set('busy', Session.get('busy') - 1);
                            }
                        });
                    }
                });

            Router.go("list");

        }

    },

    'click .js-challenge'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1));

        template.zone.setChallenge(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),

            function (error, tranHash) {
                if (error) {
                    sAlert.error('Report error: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Network Access Failure'
                        });

                    Session.set('busy', Session.get('busy') - 1);

                } else {

                    sAlert.info('A request to respond to Challenge has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Challenge Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not set Challenge on Activity: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to set Challenge'
                                });

                            Session.set('busy', Session.get('busy') - 1);

                        } else {
                            //todo: small chance the zone might not exist but decided not to test because it is so unlikely

                            // get the challenge value here and set tha reactive var - challenge

                            template.challenge.set(template.zone.getChallenge({
                                from: ZidStore.get().getAddresses()[0]
                            }));

                            sAlert.info('Activity Challenge set at block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Activity Challenged'
                                });

                            Session.set('busy', Session.get('busy') - 1);
                        }
                    });
                }
            });


    },


    'click .js-share'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: i18n.t("details.js-share.message", {address: template.address}), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("details.js-share.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("details.js-share.url"),
            chooserTitle: i18n.t("details.js-share.title") // Android only, you can override the default share sheet title
        };

        // todo: need to improve this
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
            message: i18n.t(
                "details.js-send.message",
                {address: template.address, instruction: template.sfDescription}
            ), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("details.js-send.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("details.js-send.url"),
            chooserTitle: i18n.t("details.js-send.title") // Android only, you can override the default share sheet title
        };

        // todo: needs tidying up
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

