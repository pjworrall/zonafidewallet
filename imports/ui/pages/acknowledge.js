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

        if(!zone.amIAnAcknowledger(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]))) {
            sAlert.info('Activity does not have you as an Acknowledger',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Not Acknowledger'});
            return;
        }

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1) );

        console.log("z/acknowledge busy was: "  + busyQ + ' now: ' +  Session.get('busy') );

        // get the gas price
        let gasPrice = ZonafideWeb3.getGasPrice();

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
        // Estimate of gas usage
        let gas = ZonafideWeb3.getGasEstimate(
            zone,
            zone.setAcknowledgement,
            params
        );

        // override gasPrice and gas limit values
        params.gas = gas;
        params.gasPrice = gasPrice;

        zone.setAcknowledgement(params, function (error, tranHash) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                if (error) {
                    sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);

                    Session.set('busy',  Session.get('busy') - 1  );

                } else {

                    sAlert.info('Acknowledging the Activity', ZoneAlertContent.waiting);

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Encountered error: ' + error.toString(), ZoneAlertContent.inaccessible);

                                Session.set('busy',  Session.get('busy') - 1  );

                        } else {
                            sAlert.info('Activity Acknowledged', ZoneAlertContent.confirmed);

                            Session.set('busy',  Session.get('busy') - 1  );
                        }
                    });

                }
            });
    }

});
