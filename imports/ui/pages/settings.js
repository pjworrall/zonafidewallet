/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

import Transaction from 'ethereumjs-tx';

import './settings.html';

Template.settings.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.settings.onCreated(function () {

    this.balance = new ReactiveVar();

    //this.balance.set(ZonafideWeb3.getBalance());

    this.balance.set("N/A");

    this.recipient = new ReactiveVar('');

});

Template.settings.helpers({
    balance() {
        return Template.instance().balance.get();
    },

    server() {

        var settings = ZonafideDappData.findOne({document: "settings"});

        if (settings && settings.server) {
            return settings.server;
        } else {
            return ZonafideEnvironment.Node;
        }
    },

    recipient() {
        return  Template.instance().recipient.get();
    }

});

Template.settings.events({

    // todo: please let this be the last time I cut and paste this before refactoring!!!
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
                        template.recipient.set(result.text);
                    }
                }
            }, $('#reader')
        );
    },

    // todo: this can be refactored out in some way. Duplication!!
    'click #contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if(contact.ims && contact.ims.length) {
                contact.ims.some( function(address) {
                    if(address.value.startsWith("ZID:")) {
                        var zid = address.value.split(":");
                        template.recipient.set(zid[1]);
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

    'submit .setNode'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log(".setNode called...");

        const server = event.target.server.value;

        // todo: should check "server" is a valid url

        ZonafideDappData.update({document: "settings"},
            {
                document: "settings",
                server: server
            },
            // if document does not exist yet create it
            {upsert: true}
        );

        ZonafideWeb3.reset();

    },

    'click #getBalance'(event) {

        event.preventDefault();

        console.log(".getBalance called...");

        try {

            var balance = ZonafideWeb3.getBalance();

            var round = Math.round(balance).toString();

            Template.instance().balance.set(NumberWithCommas.convert(round));

        } catch (error) {
            sAlert.error(error.toString(),
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Could not retrieve balance'});
        }
    },

    'click #getSeed'() {

        var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
            alert('Your seed is: "' + ZidStore.get().getSeed(pwDerivedKey) + '". Please write it down.')
        })
    },

    'submit .transferEth'(event) {

        event.preventDefault();

        var password = prompt('Provide a session Password', 'Password');

        // todo: should check this is a valid address
        var recipient = event.target.recipient.value;
        var amount = event.target.amount.value;

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive key from password..dev issue', {timeout: 'none'});
            } else {

                // todo: problem - hooked web3 provider nonce conflict arises here. hw3p keeps track of nonce values as well.

                var w3 = ZonafideWeb3.getInstance();

                var address = ZidStore.get().getAddresses()[0];

                var count = w3.eth.getTransactionCount(address);

                // todo: general strategy needed for hex prefix's, but add it deliberately here
                amount =  '0x' + amount;

                // todo: got to get a solution for managing the gas properties across the app
                var txData = {
                    "nonce": count,
                    "gasLimit" : "0x2fefd8",
                    "gasPrice" : "0xba43b7400",
                    "to": recipient,
                    "value": amount,
                };

                var tx = new Transaction(txData);

                var rawTx = tx.serialize().toString('hex');

                var signedTx = lightwallet.signing.signTx(ZidStore.get(),
                    pwDerivedKey,
                    rawTx,
                    address
                );

                w3.eth.sendRawTransaction(signedTx, function (txError, tranHash) {
                    if (txError) {
                        sAlert.info("Network reported: " + txError,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Transaction Failed'});

                    } else {

                        sAlert.info('A request to transfer ' + amount + ' has been made: ' + tranHash,
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
                            }
                        });

                    }
                });

            }

        });


    }


});