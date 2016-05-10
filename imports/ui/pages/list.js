/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './list.html';

Template.list.onCreated(function () {

    this.ZoneStateSymbols = {
        new: 'fa fa-plus-circle',
        members: 'fa fa-circle-o-notch',
        acknowledged: 'fa fa-circle-o',
        actioned: 'fa fa-check-circle-o',
        confirmed: 'fa fa-check-circle',
        pause: 'fa fa-question-circle',
        unknown: 'fa fa-check-circle'
    };

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

    'submit .create'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('performing create event');

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        Zone.new(ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, contract) {
                if (!error) {

                    if (typeof contract.address != 'undefined') {
                        console.log('Confirmed. address: '
                            + contract.address
                            + ' transactionHash: '
                            + contract.transactionHash);

                        ZidUserLocalData.insert({
                            address: contract.address,
                            symbol: template.ZoneStateSymbols.new
                        });
                    }

                } else {
                    // todo: alert, geth call failed
                    console.log('geth callback error: ' + error);
                }
            });
    },

    'submit .addMember'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('addMember.event: called');

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        zone.setMembers([zid], quorum,
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),

            function (error, obj) {
                if (error) {
                    console.log("ERROR - members.events: " + err);
                } else {
                    console.log("INFO - members.events: " + obj);
                }
            });
    },

    'submit .acknowledge'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('acknowledge.events: called');

        const zad = event.target.zad.value;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        zone.setAcknowledgement(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, obj) {

                if (err) {
                    console.log("ERROR - acknowledge.events: " + err);
                } else {
                    console.log("INFO - acknowledge.events: " + obj);
                }
            });
    },
    'submit .status'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('status.events: called');

        const zad = event.target.zad.value;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        zone.isQuorum(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, obj) {

                if (err) {
                    console.log("ERROR - status.events: " + err);
                } else {
                    console.log("INFO - status.events: " + obj);
                }

            });

        zone.isActive(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, obj) {

                if (err) {
                    console.log("ERROR - status.events: " + err);
                } else {
                    console.log("INFO - status.events: " + obj);
                }

            });

    }

});
