/**
 * Created by pjworrall on 11/05/2016.
 */

import { Template } from 'meteor/templating';

import './zone.html';

Template.list.onRendered(function() {
    $('.tooltipped').tooltip();
});

Template.zone.onCreated(function () {
    var ks = this.KeyStore = ZidStore.get();

    var web3;
    if (typeof ks != 'undefined') {
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.Zone = web3.eth.contract(ZonafideEnvironment.abi);
    } else {
        // todo: alert problem with settign Web3 provider
        console.log('no keystore: Have we unlocked a ZID?');
    }
});

Template.zone.helpers({
    //
});

Template.zone.events({

    'dblclick .zone'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('dbclick .zone: called');

        const id = $(template.find('input[name=zad]')).val();

        Router.go("members", {_id: id});

    },

    'click .zone'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .zone: called');

        const id = $(template.find('input[name=zad]')).val();
        const zad = ZidUserLocalData.findOne(id).address;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        // todo: should show progress when it is off doing this!!!

        // todo: these are async so we really need to chain them in a promise
        // todo: however we should test final states first and exit if met
        // todo: to save time checking prerequisite states
        // todo: doing it rough here to fake it but not efficient

        zone.isQuorum(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, quorum) {
                if (err) {
                    console.log("ERROR - getting quorum ststus for Zone " + err);
                } else {
                    if(quorum) {
                        ZidUserLocalData.update({_id : id},{$set:{symbol : ZoneStateSymbols.acknowledged}});
                    }
                }
            });

        zone.isActive(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (err, active) {
                if (err) {
                    console.log("ERROR - getting active status for Zone: " + err);
                } else {
                    if(active) {
                        ZidUserLocalData.update({_id : id},{$set:{symbol : ZoneStateSymbols.active}});
                    }
                }
            });

        // todo : and others up to isConfirmed

    }

});
