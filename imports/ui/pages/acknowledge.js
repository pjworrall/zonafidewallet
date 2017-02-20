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
import  {ZidStore} from '/imports/startup/client/globals.js';

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

        // todo: what will this actually catch? what circumstances cause a throw?
        let zone; try {
            zone = factory.at(zad);
        } catch (error) {
            sAlert.info('Activity inaccessible: ' + error,
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Activity inaccessible'});
            return;
        }

        // todo: should maybe check we are a valid acknoweldger before marching on with setting an ack

        zone.setAcknowledgement(
            ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
            function (error, tranHash) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Access Failure'
                        });
                } else {
                    sAlert.info('A request to acknowledge an Activity ' + zad + 'has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Acknowledgment request made'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not acknowledge Activity: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to Acknowledge Activity'
                                });
                        } else {
                            sAlert.info('A request to acknowledge an Activity ' + zad + 'has been made at block ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Activity Acknowledged'
                                });
                        }
                    });

                }
            });
    }

});
