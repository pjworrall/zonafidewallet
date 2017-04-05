/**
 * Created by pjworrall on 03/05/2016.
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import '../../api/html5-qrcode/html5-qrcode.min.js';
import '../../api/html5-qrcode/jsqrcode-combined.min.js';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { AddressRules } from '/imports/startup/client/validation.js';
import  { ZoneQRScanner } from '/imports/startup/client/qrscanner.js';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  { ZoneTransactionReceipt } from '/imports/startup/client/receipt.js';
import  { ZidStore, ZidUserLocalData, ZoneState } from '/imports/startup/client/globals.js';

import './members.html';

Template.members.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

    this.zid = new ReactiveVar('');

});

Template.members.onRendered(function () {

    this.$('.add').validate({
        rules: {
            zid: AddressRules.rules,
        },
        messages: {
            zid: AddressRules.messages,
        }
    });

});

Template.members.helpers({
    address() {

        let zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return zone.address;
    },
    name() {

        let zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return zone.name;
    },
    zid() {
        return Template.instance().zid.get();
    }
});

Template.members.events({

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
                        template.zid.set(result.text);
                    }
                }
            }, $('#reader')
        );

    },

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click .js-contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if (contact.ims && contact.ims.length) {
                contact.ims.some(function (address) {
                    if (address.value.startsWith("ZID:")) {
                        var zid = address.value.split(":");
                        template.zid.set(zid[1]);
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

    'submit .add'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("click .js-acknowledgers");

        const zad = template.$('input[name=zad]').val();
        const zid = template.$('input[name=zid]').val();

        if (zid === null || zid.match(/^ *$/) !== null) {
            sAlert.info("No Acknowledger address provided",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Address required'});
        } else {

            let Zone = template.Zone;

            let zone = Zone.at(zad);

            // todo: quorum set hard at 1 for now
            const quorum = 1;

            let busyQ = Session.get('busy');
            Session.set('busy', (busyQ + 1) );

            zone.setMembers([zid], quorum,
                ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),

                function (error, tranHash) {
                    if (error) {
                        sAlert.error('Report error: ' + error,
                            {
                                timeout: 'none',
                                sAlertIcon: 'fa fa-exclamation-circle',
                                sAlertTitle: 'Network Access Failure'
                            });

                        Session.set('busy', Session.get('busy') - 1  );

                    } else {

                        sAlert.info('A request to add an Acknowledger has been made: ' + tranHash,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Acknowledger Requested'});

                        ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                            if (error) {
                                sAlert.info('Could not add Acknowledger to Activity: ' + error.toString(),
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Failed to Add Acknoweldger'
                                    });

                                Session.set('busy', Session.get('busy') - 1  );

                            } else {
                                // careful here..using address property rather that unique id of record, should be same impact
                                ZidUserLocalData.update({address: zad}, {$set: {state: ZoneState.ACKNOWLEDGERS}});

                                sAlert.info('Acknowledger added to Activity at block: ' + receipt.blockNumber,
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Acknowledger Added'
                                    });

                                Session.set('busy', Session.get('busy') - 1  );
                            }
                        });
                    }
                });
        }

    }

});