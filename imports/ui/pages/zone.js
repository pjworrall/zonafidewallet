/**
 * Created by pjworrall on 11/05/2016.
 */

import {Template} from 'meteor/templating';

import './zone.html';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZidStore, ZidUserLocalData, ZoneStateAttributes, ZoneState} from '/imports/startup/client/globals.js';

import { ReactiveVar } from 'meteor/reactive-var';

Template.zone.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

    this.ZoneRecord = new ReactiveVar(ZidUserLocalData.findOne(this.data._id));

});

Template.zone.helpers({
    action() {
        return ZoneStateAttributes[Template.instance().ZoneRecord.get().state].action;
    },

    symbol() {
        return ZoneStateAttributes[Template.instance().ZoneRecord.get().state].symbol;
    },
    color() {
        return ZoneStateAttributes[Template.instance().ZoneRecord.get().state].color;
    }
});

Template.zone.events({

    'click .js-action'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        let zone = template.ZoneFactory.at(template.ZoneRecord.get().address);

        let id = template.ZoneRecord.get()._id;

        /*
         If the Activity is confirmed then set the state. If the Activity is waiting on Acknowledgements then
         check if quorum and set stat to Acknowledged.
         */

        if (zone.isConfirmed(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]))) {

            ZidUserLocalData.update({_id: id}, {$set: {state: ZoneState.CONFIRMED}});

        } else if (template.ZoneRecord.get().state === ZoneState.WAIT_ON_ACKNOWLEDGERS || template.ZoneRecord.get().state === ZoneState.ACKNOWLEDGERS ) {
            if (zone.isQuorum(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]))) {
                ZidUserLocalData.update(
                    {_id: id},
                    {
                        $set: {
                            state: ZoneState.ACKNOWLEDGED
                        }
                    }
                );
            }
        }

        // refresh the ZoneRecord in case it changed since this template was created
        template.ZoneRecord.set(ZidUserLocalData.findOne(id));

        let _p = {_id: id};

        switch (template.ZoneRecord.get().state) {
            case ZoneState.NEW:
                Router.go("members", _p);
                break;
            case ZoneState.ACKNOWLEDGERS:
                Router.go("share", _p);
                break;
            case ZoneState.WAIT_ON_ACKNOWLEDGERS:
                Router.go("share", _p);
                break;
            case ZoneState.ACKNOWLEDGED:
                Router.go("action", _p);
                break;
            case ZoneState.ACTIONED:
                Router.go("send", _p);
                break;
            case ZoneState.WAIT_ON_CONFIRM:
                Router.go("send", _p);
                break;
            case ZoneState.CONFIRMED:
                Router.go("details", _p);
                break;
            default:
                sAlert.info("Did not recognise the state the Activity was in to determine what view to present.",
                    {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Developer Issue'});

        }

    },

    'click .js-details'(event, template) {

        event.preventDefault();

        Router.go("details", {_id: template.ZoneRecord.get()._id});

    }

});
