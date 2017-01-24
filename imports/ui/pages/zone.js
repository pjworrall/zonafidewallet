/**
 * Created by pjworrall on 11/05/2016.
 */

import { Template } from 'meteor/templating';

import './zone.html';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  { ZidStore, ZidUserLocalData, ZoneStateAction, ZoneState , ZoneStateSymbol, ZoneStateColor } from '/imports/startup/client/globals.js';

Template.zone.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();
    this.ZoneRecord = ZidUserLocalData.findOne(this.data._id); //Template.instance().data._id)

});

Template.zone.helpers({
    action() {
        return ZoneStateAction[Template.instance().ZoneRecord.state];
    },

    symbol() {
        return ZoneStateSymbol[Template.instance().ZoneRecord.state];
    },
    color() {
        return ZoneStateColor[Template.instance().ZoneRecord.state];
    }
});

Template.zone.events({

    'click .js-action'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        // todo: confused to what is going on fron zad - id - record.address? clarify.
        const id = template.$('input[name=zad]').val();
        const record = ZidUserLocalData.findOne(id);
        const zad = record.address;

        let zone = template.ZoneFactory.at(zad);

        /*

         todo: Currently the use of functions on the contract to determine state may cause
         too many rpc calls. Consider using a flag so one call can be made to determine
         all states.

         */

        let quorum = zone.isQuorum(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]));
        let confirmed = zone.isConfirmed(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]));

        if (confirmed) {
            ZidUserLocalData.update({_id: id}, {$set: {state: ZoneState.CONFIRMED}});
            Router.go("details", {_id: id});
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
            sAlert.info("Did not recognise the state the Activity was in to determine what view to present.",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Developer Issue'});
        }

    },

    'click .js-details'(event, template) {

       event.preventDefault();

        const id = template.$('input[name=zad]').val();

        Router.go("details", { _id: id } );

    }

});
