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
import  {ZidStore, ZoneAlertContent } from '/imports/startup/client/globals.js';

import  {AddressRules} from '/imports/startup/client/validation.js';


Template.verify.onCreated(function () {

    this.ZoneFactory = ZonafideWeb3.getFactory();

    this.Zone = new ReactiveVar();

    this.zid = new ReactiveVar();
    this.zad = new ReactiveVar();
    this.member = new ReactiveVar();
    this.hashCheck = new ReactiveVar();
    this.challenge = new ReactiveVar();

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

    let template = this;
    this.$('#zad').on("input", function () {
        console.log("z/ verify zad input changed" );
        template.Zone.set(null);
    });

});

Template.verify.helpers({

    zone() {
        return Template.instance().Zone.get();
    },
    owner() {

        let zone = Template.instance().Zone.get();

        if(zone) {
            return zone.getOwner({
                from: ZidStore.get().getAddresses()[0]
            });
        }
    },
    member() {
        return Template.instance().member.get();
    },
    zid() {
        return Template.instance().zid.get();
    },
    zad() {
        return Template.instance().zad.get();
    }
    ,
    isActive() {

        let zone = Template.instance().Zone.get();

        if(zone) {
            return zone.isActive({
                from: ZidStore.get().getAddresses()[0]
            });
        }

    },
    whatIsActive() {

        let zone = Template.instance().Zone.get();

        if(zone) {
            return zone.whatIsActive({
                from: ZidStore.get().getAddresses()[0]
            });
        }
    },
    isConfirmed() {
        let zone = Template.instance().Zone.get();

        if(zone) {
            return zone.isConfirmed({
                from: ZidStore.get().getAddresses()[0]
            });
        }
    },
    hashCheck() {
        return Template.instance().hashCheck.get();
    },
    challenge() {
        return Template.instance().challenge.get();
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
                    sAlert.info("Problem scanning: " + error, ZoneAlertContent.problem);
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

        $('#reader').empty();

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
    // todo: this can be refactored out in some way. Duplication!!
    'click .js-contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if (contact.ims && contact.ims.length) {
                contact.ims.some(function (address) {
                    if (address.value.startsWith("ZID:")) {
                        let zid = address.value.split(":");
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

    'submit .js-read'(event, template) {

        event.preventDefault();

        //todo: what if zone not found or there is an error?

        const zad = $(template.find('input[name=zad]')).val();

        // todo: this reoccurs. needs refactoring.
        if("0x" === template.ZoneFactory.eth.getCode(zad)) {
            sAlert.info('Is Activity Address correct?',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Not an Activity'});
            return;
        }

        // todo: should maybe have a try catch
        let zone = template.ZoneFactory.at(zad);


        // check this user is the validator
        if(!zone.amIVerifier(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]))) {
            sAlert.info('Activity does not have you as the Verifier',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Not Verifier'});
        } else {
            template.Zone.set(zone);

            //reset any reactive vars for the previous Zone

            let v;
            template.member.set(v);
            template.zid.set(v);
        }

    },

    'submit .js-check'(event, template) {

        event.preventDefault();

        console.log("click .js-check");

        let zone = template.Zone.get();

        if (zone) {

            let memberZid = $(template.find('input[name=zid]')).val();

            console.log("zid: " + memberZid);

            let member = {
                isMember: false,
                isAcknowledger: false,
            };


            member.isMember = zone.isMember(memberZid, {
                from: ZidStore.get().getAddresses()[0]
            });

            member.isAcknowledger = zone.isAcknowledger(memberZid, {
                from: ZidStore.get().getAddresses()[0]
            });

            template.member.set(member);

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }

    },

    'click .js-confirm'(event, template) {

        event.preventDefault();

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1) );

        let zone = template.Zone.get();

        if (zone) {

            // get the gas price
            let gasPrice = ZonafideWeb3.getGasPrice();

            let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
            // Estimate of gas usage
            let gas = ZonafideWeb3.getGasEstimate(
                zone,
                zone.confirm,
                params
            );

            // override gasPrice and gas limit values
            params.gas = gas;
            params.gasPrice = gasPrice;

            zone.confirm(params, function (error, tranHash) {
                if (error) {
                    sAlert.error('Report error: ' + error,
                        {
                            timeout: 'none',
                            sAlertTitle: 'Network Access Failure'
                        });

                    Session.set('busy', Session.get('busy') - 1  );

                } else {
                    sAlert.info('Request to Confirm submitted: ', ZoneAlertContent.waiting);

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Encountered error: ' + error.toString(), ZoneAlertContent.inaccessible);

                            Session.set('busy', Session.get('busy') - 1  );
                        } else {
                            sAlert.info('Confirmed Activity', ZoneAlertContent.confirmed);

                            Session.set('busy', Session.get('busy') - 1  );
                        }
                    });
                }
            });

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }
    },

    'submit .js-hash'(event, template) {

        event.preventDefault();

        console.log("submit .js-hash");

        let sfDescription = $(template.find('textarea[name=sfDescription]')).val();

        let zone = template.Zone.get();

        if (zone) {
            let inputHash = ZonafideWeb3.getInstance().sha3(sfDescription);
            let contractHash = zone.whatIsActive({
                from: ZidStore.get().getAddresses()[0]
            });

            if(inputHash === contractHash) {
                template.hashCheck.set(true);
            } else {
                template.hashCheck.set(false)
            }

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }

    },

    'submit .js-challenge'(event, template) {

        event.preventDefault();

        console.log("submit .js-challenge");

        let zone = template.Zone.get();

        if (zone) {

            let bool = zone.getChallenge({
                from: ZidStore.get().getAddresses()[0]
            });

            template.challenge.set(bool);

        } else {
            sAlert.info("Provide an Activity first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Activity'});
        }

    }

});