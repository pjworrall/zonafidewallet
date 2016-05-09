/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';

import './list.html';


Template.list.helpers({

    zads() {
        // todo: I've got big GO ZADS'
      console.log('providing us with current ZADS');

        return ZidUserLocalData.find();
    }
});



Template.list.events({

    'submit .create'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('performing create event');

        var keyStore = ZidStore.get();

        var web3;
        if (typeof keyStore != 'undefined') {
            web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node,keyStore);
        } else {
            // todo: alert problem with settign Web3 provider
            console.log('performing create event');
        }

        var Zone = web3.eth.contract(ZonafideEnvironment.abi);

        Zone.new(ZonafideEnvironment.caller(keyStore.getAddresses()[0]), function (error, contract) {
                if (!error) {
                    if (typeof contract.address != 'undefined') {
                       console.log('Confirmed. address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

                        ZidUserLocalData.insert({_id: contract.address});

                        Session.set('zad', contract.address);
                    }
                } else {
                    // todo: alert, geth call failed
                console.log('geth callback error: ' + error);
                }

            });

    }
});