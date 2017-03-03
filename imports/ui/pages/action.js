/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import '../../api/html5-qrcode/html5-qrcode.min.js';
import '../../api/html5-qrcode/jsqrcode-combined.min.js';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZidStore, ZidUserLocalData, ZidUserLocalPersonalData, ZoneState} from '/imports/startup/client/globals.js';

import  {AddressRules} from '/imports/startup/client/validation.js';

import './action.html';

Template.action.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

});

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
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.$('input[name=zid]').val(result.text);
                    }
                }
            }, $('#reader')
        );
    }, // todo: this can be refactored out in some way. Duplication!!
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
                sAlert.info("No Zonafide Address found",
                    {
                        timeout: 'none',
                        sAlertIcon: 'fa fa-info-circle',
                        sAlertTitle: 'Not found'
                    });
            }

        }, function (err) {
            sAlert.info("Error accessing contacts: " + err,
                {
                    timeout: 'none',
                    sAlertIcon: 'fa fa-info-circle',
                    sAlertTitle: 'Contacts error'
                });
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

        /*
         todo: this has to be encrypted with the counter party ZID
         */
        let description = {
            action: template.$('input[name=action]').val(),
            reference: template.$('input[name=reference]').val()
        };

        const includePersonalDetails = template.$('input[name=details]').is(':checked');

        console.log("includePersonalDetails: " + includePersonalDetails);

        if (includePersonalDetails) {

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

        let zone = template.ZoneFactory.at(zad);

        // got to hash the description

        let hash = ZonafideWeb3.getInstance().sha3(
                JSON.stringify(description)
            );

        console.log("hashing: " + JSON.stringify(description) + ", to: " + hash);

        zone.action(hash, zid,
            ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
            function (error, tranHash) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                console.log("error: " + error + ", obj: " + tranHash);

                if (error) {
                    sAlert.error('Report error: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Network Failure'

                        });
                } else {

                    sAlert.info('A request to action an Activity has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Activity Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not action an Activity: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to Action an Activity'
                                });
                        } else {
                            // todo: watchout, using address property and not record id
                            ZidUserLocalData.update({address: zad},
                                {
                                    $set: {
                                        state: ZoneState.ACTIONED,
                                        description: description
                                    }
                                }
                            );

                            sAlert.info('Activity in block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Activity Actioned'
                                });
                        }
                    });

                }
            });
    }

});

