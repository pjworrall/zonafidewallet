/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/api/html5-qrcode/html5-qrcode.min.js';
import '/imports/api/html5-qrcode/jsqrcode-combined.min.js';

import './acknowledge.html';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { ZoneQRScanner } from '/imports/startup/client/qrscanner.js';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  { ZoneTransactionReceipt } from '/imports/startup/client/receipt.js';

Template.acknowledge.onCreated(function () {

    this.zad = new ReactiveVar('');

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

});


Template.acknowledge.helpers({

    zad() {
        return  Template.instance().zad.get();
    }

});

Template.acknowledge.events({

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click #qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('qrscanner.events: called');

        ZoneQRScanner.scan( function (error, result) {

                if (error) {
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if(!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.zad.set(result.text);
                    }
                }
            }, $('#reader')
        );

    },

    'click #do'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('acknowledge.events: called');

        const zad = $(template.find('input[name=zad]')).val();

        // todo: should test ZAD for validity and reject if not valid!!!

        var Zone = template.Zone;

        var zone = Zone.at(zad);

        zone.setAcknowledgement(
            ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
            function (error, tranHash) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Zonafide Access Failure'});
                } else {
                    sAlert.info('A request to acknowledge Zone ' + zad + 'has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Acknowledgment request made'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not acknowledge Zone: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to Acknowledge Zone'
                                });
                        } else {
                            sAlert.info('A request to acknowledge Zone ' + zad + 'has been made at block ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Zone Acknowledged'
                                });
                        }
                    });

                }
            });
    }

});
