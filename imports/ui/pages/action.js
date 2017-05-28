/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';

import '../../api/html5-qrcode/html5-qrcode.min.js';
import '../../api/html5-qrcode/jsqrcode-combined.min.js';

import  {Activity} from '/imports/startup/client/activity.js';
import  {Monitor} from '/imports/startup/client/monitor.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZidStore, ZidUserLocalData, ZidUserLocalPersonalData, ZoneState, ZoneAlertContent } from '/imports/startup/client/globals.js';

import  {AddressRules} from '/imports/startup/client/validation.js';

import './action.html';


Template.action.onRendered(function () {

    this.$('.js-action').validate({
        rules: {
            zid: AddressRules.rules
        },
        messages: {
            zid: AddressRules.messages
        }
    });
});

Template.action.helpers({

    name() {

        let zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return zone.name;
    }

});

Template.action.events({

    'click .js-qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .qrscanner');

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    sAlert.info("Problem scanning: " + error, ZoneAlertContent.problem);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.$('input[name=zid]').val(result.text);
                    }
                }
            }, $('#reader')
        );
    },

    'click .js-contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if (contact.ims && contact.ims.length) {
                contact.ims.some(function (address) {
                    if (address.value.startsWith("ZID:")) {
                        let zid = address.value.split(":");
                        template.$('input[name=zid]').val(zid[1]);
                        return true;
                    }
                });
            } else {
                sAlert.info("No Zonafide Address found", ZoneAlertContent.not_found);
            }

        }, function (error) {
            sAlert.info("Problem accessing contacts: " + error, ZoneAlertContent.problem);
        });

    },

    'submit .js-action'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-action');

        let zoneRecord = ZidUserLocalData.findOne(
            template.data._id);

        const zad = zoneRecord.address;
        const zid = template.$('input[name=zid]').val();

        let description = {
            action: template.$('input[name=action]').val(),
            reference: template.$('input[name=reference]').val()
        };

        if (template.$('input[name=details]').is(':checked')) {

            let pd = ZidUserLocalPersonalData.findOne();

            // todo:  this should not run if pd is null or undefined
            if (pd) {
                description = {
                    action: description.action,
                    reference: description.reference,
                    firstName: pd.firstName,
                    familyName: pd.familyName,
                    houseId: pd.houseId,
                    streetAddress: pd.streetAddress,
                    postCode: pd.postCode
                }
            } else {
                sAlert.info("We didn't find any personal details to use. Provide some and try again.",
                    {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No personal details'});
                return;
            }
        }

        // got to hash the description
        let hash = ZonafideWeb3.getInstance().sha3(JSON.stringify(description));

        let _activity = new Activity();
        _activity.get(ZonafideWeb3.getInstance(), zad);

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1) );

        // get the gas price
        let gasPrice = ZonafideWeb3.getGasPrice();

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);

        // override gasPrice and gas limit values
        params.gas = ZonafideWeb3.getGasEstimate(
            _activity.contract,
            _activity.contract.action,
            hash,
            zid,
            params
        );

        params.gasPrice = gasPrice;

        let _monitor = new Monitor();

        _monitor.completed = function (receipt) {

            console.log("z/ .js-action actioned contract: " + receipt.to +
                ", transaction hash: " + receipt.transactionHash );
            // todo: watchout, using address property and not record id
            ZidUserLocalData.update({_id: zoneRecord._id},
                {
                    $set: {
                        state: ZoneState.ACTIONED,
                        description: description
                    }
                }
            );

            sAlert.info('Activity Actioned', ZoneAlertContent.confirmed);

            Session.set('busy', Session.get('busy') - 1  );
        };

        _monitor.requested = function (transactionHash) {
            console.log("z/ .js-action transaction: " + transactionHash);
            sAlert.info('Actioning the Activity', ZoneAlertContent.waiting);
        };

        _monitor.error = function (error) {
            sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
            Session.set('busy', Session.get('busy') - 1);
        };


        _activity.action(hash, zid, ZonafideWeb3.getInstance(), params, _monitor);

    }

});

