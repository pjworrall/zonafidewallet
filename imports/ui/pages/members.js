/**
 * Created by pjworrall on 03/05/2016.
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import '../../api/html5-qrcode/html5-qrcode.min.js';
import '../../api/html5-qrcode/jsqrcode-combined.min.js';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {AddressRules} from '/imports/startup/client/validation.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZidStore, ZidUserLocalData, ZoneState, ZoneAlertContent, ZidAddressData} from '/imports/startup/client/globals.js';

import './members.html';

Template.members.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

    this.ZoneRecord = ZidUserLocalData.findOne(Template.instance().data._id);

    // the additional reference is to make this reactive var available to the child template
    this.zid = this.data.zid = new ReactiveVar('');

});

Template.members.onRendered(function () {

    this.$('.js-add').validate({
        rules: {
            zid: AddressRules.rules,
        },
        messages: {
            zid: AddressRules.messages,
        }
    });

});

Template.members.helpers({
    name() {

        let zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return zone.name;
    },
    zid() {
        return Template.instance().zid.get();
    },

    record() {
        return ZidAddressData.find({
            zid: ZidStore.get().getAddresses()[0]
        }, {
            sort: {created: -1}
        });
    }
});

Template.members.events({

    'click .js-qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-qrscanner');

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    sAlert.info("Problem scanning: " + error, ZoneAlertContent.problem);
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
                sAlert.info("No Zonafide Address found", ZoneAlertContent.not_found);
            }

        }, function (error) {
            sAlert.info("Problem accessing contacts: " + error, ZoneAlertContent.problem);
        });

    },

    'submit .js-add'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("submit .js-add");

        const zid = template.$('input[name=zid]').val();

        let zone = template.ZoneFactory.at(template.ZoneRecord.address);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1));

        // get the gas price
        let gasPrice = ZonafideWeb3.getGasPrice();

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
        // Estimate of gas usage
        let gas = ZonafideWeb3.getGasEstimate(
            zone,
            zone.setMembers,
            [zid],
            quorum,
            params
        );

        // override gasPrice and gas limit values
        params.gas = gas;
        params.gasPrice = gasPrice;

        zone.setMembers([zid], quorum, params, function (error, tranHash) {
            if (error) {
                sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
                Session.set('busy', Session.get('busy') - 1);
            } else {
                sAlert.info('Registering Acknowledger on Activity', ZoneAlertContent.waiting);

                // todo: this is changing to monitoring events
                ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                    if (error) {
                        sAlert.info('Encountered error: ' + error.toString(),
                            ZoneAlertContent.inaccessible);

                        Session.set('busy', Session.get('busy') - 1);

                    } else {

                        ZidUserLocalData.update({_id: template.ZoneRecord._id}, {$set: {state: ZoneState.ACKNOWLEDGERS}});

                        sAlert.info('Acknowledger added', ZoneAlertContent.confirmed);

                        Session.set('busy', Session.get('busy') - 1);
                    }
                });
            }
        });

    }

});