/**
 * Created by pjworrall on 21/05/2016.
 */

import {Template} from 'meteor/templating';
//import { QRCode } from 'meteor/steeve:jquery-qrcode';
import  {
    ZidUserLocalData,
    ZidStore,
    ZoneStateAttributes, ZoneAlertContent
} from '/imports/startup/client/globals.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {i18n} from '/imports/startup/client/lang.js';

import  {Activity} from '/imports/startup/client/activity.js';
import  {Monitor} from '/imports/startup/client/monitor.js';

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

            let _activity = new Activity();
            _activity.contract = template.zone;

            // todo: we already have zone so not necessary for the Activity to get it,
            // but should refactor whole template to meet new Activity model pattern
            //_activity.get(ZonafideWeb3.getInstance(), zad);

            // get the gas price
            let gasPrice = ZonafideWeb3.getGasPrice();

            let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
            params.gas = ZonafideWeb3.getGasEstimate(
                _activity.contract,
                _activity.contract.confirm,
                params
            );
            params.gasPrice = gasPrice;

            let _monitor = new Monitor();

            _monitor.completed = function (receipt) {

                console.log("z/ .js-delete completed: " + receipt.to +
                    ", transaction hash: " + receipt.transactionHash );
                ZidUserLocalData.remove({address: _activity.getAddress()});

                sAlert.info('Deleted', ZoneAlertContent.confirmed);

                Session.set('busy', Session.get('busy') - 1  );
            };

            _monitor.requested = function (transactionHash) {
                console.log("z/ .js-delete transaction: " + transactionHash);
                sAlert.info('Deletion requested', ZoneAlertContent.waiting);
            };

            _monitor.error = function (error) {
                sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
                Session.set('busy', Session.get('busy') - 1);
            };

            _activity.delete(ZonafideWeb3.getInstance(), params, _monitor);

            Router.go("list");

        }

    },

    'click .js-challenge'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: c'mon , now put it into Activity
        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1));

        let _activity = new Activity();
        _activity.contract = template.zone;

        // todo: we already have zone so not necessary for the Activity to get it,
        // but should refactor whole template to meet new Activity model pattern
        //_activity.get(ZonafideWeb3.getInstance(), zad);

        // get the gas price
        let gasPrice = ZonafideWeb3.getGasPrice();

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
        params.gas = ZonafideWeb3.getGasEstimate(
            _activity.contract,
            _activity.contract.confirm,
            params
        );
        params.gasPrice = gasPrice;

        let _monitor = new Monitor();

        _monitor.completed = function (receipt) {

            console.log("z/ .js-challenge changed challenge: " + receipt.to +
                ", transaction hash: " + receipt.transactionHash );

            // get the challenge value here and set tha reactive var - challenge

            template.challenge.set(_activity.contract.getChallenge({
                from: ZidStore.get().getAddresses()[0]
            }));

            sAlert.info('Challenge Changed', ZoneAlertContent.confirmed);

            Session.set('busy', Session.get('busy') - 1  );
        };

        _monitor.requested = function (transactionHash) {
            console.log("z/ .js-action transaction: " + transactionHash);
            sAlert.info('Challenge requested', ZoneAlertContent.waiting);
        };

        _monitor.error = function (error) {
            sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
            Session.set('busy', Session.get('busy') - 1);
        };

        _activity.challenge(ZonafideWeb3.getInstance(), params, _monitor);

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

        // if there is no instruction yet let the user know
        let details = template.sfDescription;
        if(!details) {
            details = i18n.t("details.js-send.no_details");
        }

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: i18n.t(
                "details.js-send.message",
                {address: template.address, instruction: details}
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

