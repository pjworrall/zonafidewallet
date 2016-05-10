/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './list.html';

Template.list.onCreated(function () {

    // Keystore and Zone will be available as Template.instance().X
    var ks = this.KeyStore = ZidStore.get();

    var web3;
    if (typeof ks != 'undefined') {
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.Zone = web3.eth.contract(ZonafideEnvironment.abi);
    } else {
        // todo: alert problem with settign Web3 provider
        console.log('whoops! All fell apart on create because of no key store');
    }

});

Template.list.helpers({

    zads() {
        return ZidUserLocalData.find();
    }
});

Template.list.events({

    'submit .create'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('performing create event');

        var Zone = Template.instance().Zone;
        var KeyStore = Template.instance().KeyStore;

        Zone.new(ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, contract) {
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
    },

    'submit .addMember'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('addMember.event: called');

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = Template.instance().Zone;
        var KeyStore = Template.instance().KeyStore;

        var zone = Zone.at(zad);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        zone.setMembers([zid], quorum,
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),

            function (error, obj) {
                if (error) {
                    console.log("ERROR - members.events: " + err);
                    Session.set('result', "something unexpected happened, sorry!");
                } else {
                    console.log("INFO - members.events: " + obj);
                }
            });
    },

    'submit .acknowledge'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('acknowledge.events: called');

        const zad = event.target.zad.value;

        var Zone = Template.instance().Zone;
        var KeyStore = Template.instance().KeyStore;

        var zone = Zone.at(zad);

        zone.setAcknowledgement(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, obj) {

                if (err) {
                    console.log("ERROR - acknowledge.events: " + err);
                    Session.set('result', "something unexpected happened, sorry!");
                } else {
                    console.log("INFO - acknowledge.events: " + obj);
                    Template.instance().result.set(obj);
                }

            });
    }

});




