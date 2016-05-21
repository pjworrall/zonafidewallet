/**
 * Created by pjworrall on 11/05/2016.
 */

import { Template } from 'meteor/templating';

import './zone.html';


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
    action() {
        var zone = ZidUserLocalData.findOne(
            Template.instance().data._id);
        return ZoneStateAction[zone.state];
    },

    symbol() {
        var zone = ZidUserLocalData.findOne(
            Template.instance().data._id);
        return ZoneStateSymbol[zone.state];
    }
});

Template.zone.events({

    'dblclick .zone a'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('dbclick .zone: called');

        const id = $(template.find('input[name=zad]')).val();
        const record = ZidUserLocalData.findOne(id);
        const zad = record.address;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        /*

         todo: Currently the use of functions on the contract to determine state may cause
         too many rpc calls. Consider using a flag so one call can be made to determine
         all states.

         */

        var quorum = zone.isQuorum(ZonafideEnvironment.caller(KeyStore.getAddresses()[0]));

        console.log("ZAD state is: " + zad.state);

        if (record.state == ZoneState.ACTIONED) {
            Router.go("confirm", {_id: id});

        } else if (quorum) {
            /*
                note:
                This state check is agains Ethereum. So we set ACKNOWLEDGED here because the change
                is outside the application
              */
            ZidUserLocalData.update({_id: id}, {$set: {state: ZoneState.ACKNOWLEDGED}});
            Router.go("action", {_id: id});

        } else if (record.state == ZoneState.NEW) {

            // todo: query any members that do exist and pass through to view
            Router.go("members", {_id: id});
        } else {
            // todo: we are going to need a locale capability to support multiple languages
            sAlert.info("Did not recognise the state the Zone was in to determine what view to present.",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Developer Issue'});
        }

    },

    'click #qrcode'(event, template) {

       event.preventDefault();

        console.log("single click called");

        const id = $(template.find('input[name=zad]')).val();
        const record = ZidUserLocalData.findOne(id);
        const zad = record.address;

        Router.go("code", { address: zad });

    }

});
