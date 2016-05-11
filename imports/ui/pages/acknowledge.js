/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './acknowledge.html';

Template.list.onCreated(function () {

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

Template.acknowledge.onCreated(function () {

    console.log('.acknowledge.onCreated: setting reactive vars');

    this.result = new ReactiveVar();

});


Template.acknowledge.helpers({

    result() {
        return Template.instance().result.get();
    }

});

Template.acknowledge.events({

    // ack might have to come back out into its own page
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
    }

});

