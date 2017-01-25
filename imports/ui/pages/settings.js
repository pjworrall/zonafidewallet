/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

import Transaction from 'ethereumjs-tx';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';
import  {SessionPasswordOveride, ZonafideDappData, ZidStore} from '/imports/startup/client/globals.js';

import  {AddressRules} from '/imports/startup/client/validation.js';

import './settings.html';


Template.settings.onCreated(function () {

    this.settings = ZonafideDappData.findOne({document: "settings"});

    if(this.settings  && this.settings.sessionPassword ) {
        this.sessionPassword = new ReactiveVar(this.settings.sessionPassword);
    } else {
        this.sessionPassword = new ReactiveVar(false);
    }


    this.balance = new ReactiveVar();

    this.modalTitle = new ReactiveVar();
    this.modalMessage = new ReactiveVar();

    this.gasPrice = new ReactiveVar();


    //this.balance.set(ZonafideWeb3.getBalance());

    this.balance.set("N/A");

    this.recipient = new ReactiveVar('');



});

Template.settings.onRendered(function () {

    // I think this should be this.$() to be more accurate

    this.$('.node').validate({
        rules: {
            server: {
                required: true,
                url: true
            }
        },
        messages: {
            server: {
                required: "You must enter a web address",
                url: "Address is not a valid URL"
            }
        }
    });
    // todo: this needs to be improved to have a proper validator for ethereum addresses
    this.$('.transfer').validate({
        rules: {
            recipient: AddressRules.rules,
            amount: {
                required: true,
                number: true,
                range: [0.001, 10]
            }
        },
        messages: {
            recipient: AddressRules.messages,
            amount: {
                required: "You must enter an amount",
                range: "Must be between 0.001 and 10 ETH (for your security)"
            }
        }
    });
});


Template.settings.helpers({
    balance() {
        return Template.instance().balance.get();
    },

    server() {

        let settings =Template.instance().settings;

        if (settings && settings.server) {
            return settings.server;
        } else {
            return ZonafideEnvironment.Node;
        }
    },

    recipient() {
        return Template.instance().recipient.get();
    },

    modalMessage() {
        return Template.instance().modalMessage.get();
    },

    modalTitle() {
        return Template.instance().modalTitle.get();
    },

    sessionPassword() {
        return Template.instance().sessionPassword.get();
    },
    gasPrice() {
        return Template.instance().gasPrice.get();
    }

});

Template.settings.events({

    // todo: please let this be the last time I cut and paste this before refactoring!!!
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
                        template.recipient.set(result.text);
                    }
                }
            }, $('#reader')
        );
    },

    // todo: this can be refactored out in some way. Duplication!!
    'click .js-contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-contactdb');

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if (contact.ims && contact.ims.length) {
                contact.ims.some(function (address) {
                    if (address.value.startsWith("ZID:")) {
                        var zid = address.value.split(":");
                        template.recipient.set(zid[1]);
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

    'click .js-node'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();
        event.stopPropagation();

        console.log("click .js-node");

        const server = template.$('input[name=server]').val();

        ZonafideDappData.update({document: "settings"},
            {
                document: "settings",
                server: server
            },
            // if document does not exist yet create it
            {upsert: true}
        );

        ZonafideWeb3.reset(); ZonafideWeb3.getInstance();

        if (ZonafideWeb3.isAlive()) {
            template.modalMessage.set("Access confirmed.");
        } else {
            template.modalMessage.set("Not accessible.");
        }

        // it appears I can only show modals at the end of a function
        template.modalTitle.set("Network Access Point.");
        $("#ModalContainer").modal('show');

    },

    'click .js-balance'(event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("click .js-balance");

        try {

            let balance = ZonafideWeb3.getBalance().toFixed(2).toString();
            Template.instance().balance.set(balance);

        } catch (error) {
            sAlert.error(error.toString(),
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Could not retrieve balance'});
        }
    },

    'click .js-seed'(event, template) {

        event.preventDefault();
        event.stopPropagation();

        console.log("click .js-seed");

        let settings = ZonafideDappData.findOne({document: "settings"});

        // duplicate code here. this whole password prompting thing has to be improved at soem point
        let password = null;
        if(settings && settings.sessionPassword ) {
                password = prompt('Enter password to show your Key. Do not let anyone else see the Key.');
        } else {
            password = SessionPasswordOveride;
        }

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
            template.modalTitle.set("Key Passphrase");
            template.modalMessage.set(ZidStore.get().getSeed(pwDerivedKey));
            $("#ModalContainer").modal('show');
        })
    },

    'click .js-sessionPassword'(event,template) {

        event.preventDefault();
        event.stopPropagation();

        console.log("click .js-sessionPassword");

        // toggle a Global variable for use of session password

        template.sessionPassword.set(!template.sessionPassword.get());

        console.log("session password set: " + template.sessionPassword.get());

        ZonafideDappData.update({document: "settings"},
            { $set:
                { sessionPassword: (template.sessionPassword.get()) }
            },
            // if document does not exist yet create it
            { upsert: true }
        );

        // force a restart. Because of bug where Keystore appears to get knickers in a twist
        location.reload(true);


    },

    //todo: tha above handlers were all changed to work on iOS. Did not change the form but might find it has the same problems
    //todo: fix when addressing the currency units and stuff here

    'click .js-transfer'(event, template) {

        event.preventDefault();

        console.log("click .js-transfer");

        // todo: should check this is a valid number!
        let amount = template.$('input[name=amount]').val();

        // if amount is greater than 10 ETH stop
        let maxAmountInEth = 10;
        if ( amount > maxAmountInEth ) {
             sAlert.error('Transfers restricted to ETH 10.00 maximum for your security.', {timeout: 'none'});
        return;
        }

        // todo: should check this is a valid address
        let recipient = template.$('input[name=recipient]').val();

        // todo: problem - hooked web3 provider nonce conflict arises here. hw3p keeps track of nonce values as well.
        let address = ZidStore.get().getAddresses()[0];

        let count = ZonafideWeb3.getInstance().eth.getTransactionCount(address);
        let amountInWei = ZonafideWeb3.getInstance().toWei(amount, 'ether');

        console.log("Transfer: " + "Nonce: " + count + ", to: " + recipient
             + ", value: ETH " + amount
             + "( WEI: " + amountInWei
            + " )" + " typeof " +
            typeof amountInWei);

        // todo: got to get a solution for managing the gas properties across the app
        // determining he Number() function was required on amountInWei hurt big time!!
        let txData = {
            "nonce": count,
            "gasLimit": "0x2fefd8",
            "gasPrice": "0xba43b7400",
            "to": recipient,
            "value": Number(amountInWei),
        };

        let tx = new Transaction(txData);

        let rawTx = tx.serialize().toString('hex');

        // caution. over riding some security. for low security requirement environments only

        let settings = ZonafideDappData.findOne({document: "settings"});

        let password = null;
        if (settings && settings.sessionPassword) {
            password = prompt("Provide the Session Password");
        } else {
            password = SessionPasswordOveride;
        }

        // -- end caution

        console.log("signing and submitting transaction...");

        // todo: the api ideology on this eth-lightwallet is so weird. Providing a password again here seems obsolete. but hey..it does what I want.

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive Key from password..dev issue: ' + err, {timeout: 'none'});
            } else {

                let signedTx = lightwallet.signing.signTx(ZidStore.get(),
                    pwDerivedKey,
                    rawTx,
                    address
                );

                ZonafideWeb3.getInstance().eth.sendRawTransaction(signedTx, function (txError, tranHash) {
                    if (txError) {
                        sAlert.info("Network reported: " + txError,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Transaction Failed'});

                    } else {

                        sAlert.info('A request to transfer ETH ' + amount + ' has been made: ' + tranHash,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Transfer request made'});

                        ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (rctError, receipt) {
                            if (rctError) {
                                sAlert.info('Could not complete transaction: ' + rctError.toString(),
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Transfer failed'
                                    });
                            } else {
                                sAlert.info('Transfer recorded at blocknumber ' + receipt.blockNumber,
                                    {
                                        timeout: 'none',
                                        sAlertIcon: 'fa fa-info-circle',
                                        sAlertTitle: 'Transfer completed'
                                    });
                                // clear the form
                                template.$('input[name=recipient]').val("");
                                template.$('input[name=amount]').val("");
                            }
                        });
                    }
                });
            }
        });
    },

    'click .js-pricing'(event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("click .js-pricing");

        try {

            let price = ZonafideWeb3.getGasPrice().toFixed(2).toString();

            Template.instance().gasPrice.set(price);

        } catch (error) {
            sAlert.error(error.toString(),
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Could not retrieve gas price'});
        }
    }


});