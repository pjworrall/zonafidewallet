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
    }

});

Template.settings.events({

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

    'submit .transferEth'() {

        event.preventDefault();

        var password = prompt('Provide a session Password', 'Password');

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive key from password..dev issue', {timeout: 'none'});
            } else {

                // todo: problem - hooked web3 provider nonce conflict arises here. hw3p keeps track of nonce values as well.

                var w3 = ZonafideWeb3.getInstance();

                var address = ZidStore.get().getAddresses()[0];

                var count = w3.eth.getTransactionCount(address);

                // need to get these from the form
                // todo: should really identify a framework for field validation
                var recipient = '0xf76216c08976e36aa276580efa818ffc9235cefa';
                var amount =  '0x' + '1000000000000';

                // todo: got to get a solution for managing the gas properties across the app
                var txData = {
                    "nonce": count,
                    "gasLimit" : "0x2fefd8",
                    "gasPrice" : "0xba43b7400",
                    "to": recipient,
                    "value": amount,
                };

                console.log("txData: " + JSON.stringify(txData));

                var tx = new Transaction(txData);

                console.log("tx: " + JSON.stringify(tx));

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