/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './members.html';

Template.members.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.members.onCreated(function () {
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

Template.members.helpers({
   address() {

       var zone = ZidUserLocalData.findOne(
           Template.instance().data._id);

       return  zone.address;
   }
});

Template.members.events({

    'submit .addMember'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('submit .addMember: called');

        const zad = event.target.zad.value;

        console.log('zad was: ' + zad);

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

    }

});