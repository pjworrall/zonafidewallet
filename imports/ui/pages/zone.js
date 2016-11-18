/**
 * Created by pjworrall on 11/05/2016.
 */

import { Template } from 'meteor/templating';

import './zone.html';


Template.zone.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();
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

    'click .zone a'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        const id = $(template.find('input[name=zad]')).val();
        const record = ZidUserLocalData.findOne(id);
        const zad = record.address;

        var Zone = template.Zone;

        var zone = Zone.at(zad);

        /*

         todo: Currently the use of functions on the contract to determine state may cause
         too many rpc calls. Consider using a flag so one call can be made to determine
         all states.

         */

        var quorum = zone.isQuorum(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]));
        var confirmed = zone.isConfirmed(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]));

        if (confirmed) {
            ZidUserLocalData.update({_id: id}, {$set: {state: ZoneState.CONFIRMED}});
        } else if (record.state == ZoneState.ACTIONED) {
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

        const id = $(template.find('input[name=zad]')).val();
        const record = ZidUserLocalData.findOne(id);

        console.log( "address: " + record.address + ", name: " + record.name );

        Router.go("code", { 'address': record.address, 'name': record.name });

    }

});
