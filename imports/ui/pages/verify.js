/**
 * Created by pjworrall on 15/09/2016.
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './verify.html';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {ZidStore} from '/imports/startup/client/globals.js';

import  {AddressRules} from '/imports/startup/client/validation.js';


Template.verify.onCreated(function consoleOnCreated() {

    this.ZoneFactory = ZonafideWeb3.getFactory();

    this.Zone = new ReactiveVar();

    this.zid = new ReactiveVar();
    this.zad = new ReactiveVar();
    this.member = new ReactiveVar();
    this.acknowledger = new ReactiveVar();


});

Template.verify.onRendered(function () {

    this.$('.js-read').validate({
        rules: {
            zad: AddressRules.rules
        },
        messages: {
            zad: AddressRules.messages
        }
    });

    this.$('.js-check').validate({
        rules: {
            zid: AddressRules.rules
        },
        messages: {
            zid: AddressRules.messages
        }
    });

});

Template.verify.helpers({

    zone() {
        return Template.instance().Zone.get();
    },
    member() {
        return Template.instance().member.get();
    },
    acknowledger() {
        return Template.instance().acknowledger.get();
    },
    zid() {
        return Template.instance().zid.get();
    },
    zad() {
        return Template.instance().zad.get();
    }
    ,
    isActive() {
        return Template.instance().
        Zone.get().isActive({
            from: ZidStore.get().getAddresses()[0]
        });
    },
    whatIsActive() {
        return Template.instance().
            Zone.get().whatIsActive({
                    from: ZidStore.get().getAddresses()[0]
                } );
    },
    isConfirmed() {
        return Template.instance().
        Zone.get().isConfirmed({
            from: ZidStore.get().getAddresses()[0]
        });
    }

});

Template.verify.events({

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click .js-ZadQrScanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('ZadQrScanner.events: called');

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

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click .js-ZidQrScanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('ZidQrScanner.events: called');

        //empty any previous zone details. clear elements and Zone
        //template.Zone.set();
        // template.$('input[name=zad]').val('');
        // template.$('input[name=zid]').val('');

        // empty any previous reader for web qr scanning reset

        $('#reader').empty();

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
    // todo: this can be refactored out in some way. Duplication!!
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
                sAlert.info("No ZID found",
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

    'submit .js-read'(event, template) {

        event.preventDefault();

        //todo: what if zone not found or there is an error?

        const zad = $(template.find('input[name=zad]')).val();

        template.Zone.set(template.ZoneFactory.at(zad));

        console.log("zone attributes: " +
            template.Zone.get().isActive( { from: ZidStore.get().getAddresses()[0] }) + " , " +
            template.Zone.get().whatIsActive({ from: ZidStore.get().getAddresses()[0] }));

        //reset any reactive vars for the previous Zone

        let v;
        template.member.set(v);
        template.acknowledger.set(v);
        template.zid.set(v);

    },

    'submit .js-check'(event, template) {

        event.preventDefault();

        console.log("click .js-check");

        // todo: decided to just ignore if there is no zone already established

        let zone = template.Zone.get();

        if (zone) {

            let memberZid = $(template.find('input[name=zid]')).val();

            console.log("zid: " + memberZid);

            let member = zone.isMember(memberZid, {
                from: ZidStore.get().getAddresses()[0]
            });

            template.member.set(member);

            let acknowledger = zone.isAcknowledger(memberZid, {
                from: ZidStore.get().getAddresses()[0]
            });

            template.acknowledger.set(acknowledger);

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }

    },

    'click .js-confirm'(event, template) {

        event.preventDefault();

        // todo: ignore when no Zone instantiated

        let zone = template.Zone.get();

        if (zone) {

            zone.confirm(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]), function (error, tranHash) {
                if (error) {
                    sAlert.error('Report error: ' + error,
                        {
                            timeout: 'none',
                            sAlertTitle: 'Network Access Failure'
                        });
                } else {
                    sAlert.info('A request to confirm has been made: ' + tranHash,
                        {timeout: 'none', sAlertTitle: 'Confirm Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not confirm Activity: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertTitle: 'Failed to confirm Activity'
                                });
                        } else {
                            sAlert.info('Confirmed Activity at block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertTitle: 'Activity Confirmed'
                                });
                        }
                    });
                }
            });

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }
    }

});