/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import '/imports/api/html5-qrcode/html5-qrcode.min.js';
import '/imports/api/html5-qrcode/jsqrcode-combined.min.js';

import './acknowledge.html';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZidStore, ZoneAlertContent} from '/imports/startup/client/globals.js';

import  {Activity} from '/imports/startup/client/activity.js';
import  {Monitor} from '/imports/startup/client/monitor.js';


import  {AddressRules} from '/imports/startup/client/validation.js';

Template.acknowledge.onCreated(function () {

    this.zad = new ReactiveVar('');

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

});

Template.acknowledge.onRendered(function () {

    this.$('.js-acknowledge').validate({
        rules: {
            zad: AddressRules.rules
        },
        messages: {
            zad: AddressRules.messages
        }
    });
});


Template.acknowledge.helpers({

    zad() {
        return Template.instance().zad.get();
    }

});

Template.acknowledge.events({

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click .js-qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-qrscanner');

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.zad.set(result.text);
                    }
                }
            }, $('#reader')
        );

    },

    'submit .js-acknowledge'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-acknowledge');

        const zad = $(template.find('input[name=zad]')).val();

        let factory = template.ZoneFactory;

        if("0x" === factory.eth.getCode(zad)) {
            sAlert.info('Is Activity Address correct?',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Not an Activity'});
            return;
        }

        let _activity = new Activity();
        _activity.get(ZonafideWeb3.getInstance(), zad);

        if(!_activity.contract.amIAnAcknowledger(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]))) {
            sAlert.info('Activity does not have you as an Acknowledger',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Not Acknowledger'});
            return;
        }


        // todo: this should go into Activity now so it is not duplicated across the controllers
        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1) );

        // todo : all this params stuff should go into the Activity model now

        // get the gas price
        let gasPrice = ZonafideWeb3.getGasPrice();

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);

        // override gasPrice and gas limit values
        params.gas = ZonafideWeb3.getGasEstimate(
            _activity.contract,
            _activity.contract.setAcknowledgement,
            params
        );
        params.gasPrice = gasPrice;


        let _monitor = new Monitor();

        _monitor.completed = function (receipt) {

            console.log("z/ .js-acknowledge acknowledged contract: " + receipt.to +
                ", transaction hash: " + receipt.transactionHash );

            sAlert.info('Activity Acknowledged', ZoneAlertContent.confirmed);

            Session.set('busy', Session.get('busy') - 1  );
        };

        _monitor.requested = function (transactionHash) {
            console.log("z/ .js-acknowledge transaction: " + transactionHash);
            sAlert.info('Acknowledging the Activity', ZoneAlertContent.waiting);
        };

        _monitor.error = function (error) {
            sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
            Session.set('busy', Session.get('busy') - 1);
        };

        _activity.acknowledge(ZonafideWeb3.getInstance(), params, _monitor);

    }

});
