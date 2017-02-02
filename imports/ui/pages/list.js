/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';

import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  { ZidStore, ZidUserLocalData, ZoneState } from '/imports/startup/client/globals.js';

import './list.html';

Template.list.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

});

Template.list.helpers({

    zads() {
        return ZidUserLocalData.find({
            zid: ZidStore.get().getAddresses()[0]
        }, {
            sort: {created: -1}
        });
    }

});

Template.list.events({

    'click .js-create'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-create');

        // if there are already five Zones let the user no that is the current limit

        let count = ZidUserLocalData.find({
                zid: ZidStore.get().getAddresses()[0]
            }).count();

        if (count >= 5) {
            sAlert.info('Currently only five records of Activities can be recorded',
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Activity Record Limit'});
        } else {

            let name = template.$('input[name=name]').val();

            if (name === null || name.match(/^ *$/) !== null) {

                sAlert.info("Provide a name for the Activity",
                    {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Name required'});
                return;

            } else {
                // get rid of any unnecessary spaces
                name = name.trim();
            }

            let Zone = template.Zone;

            Zone.new(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
                function (error, contract) {
                    if (!error) {

                        if (typeof contract.address != 'undefined') {

                            ZidUserLocalData.insert({
                                zid: ZidStore.get().getAddresses()[0],
                                created: new Date(),
                                address: contract.address,
                                state: ZoneState.NEW,
                                name: name
                            });

                            // todo: got to refactor out the parameters here and across all alerts currently
                            // todo: I mean. shouldn't using the info method provide appropriate symbol?
                            sAlert.info(contract.address,
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Activity ' + name + ' established'});
                        } else {
                            sAlert.info('An Activity is being registered: ' + contract.transactionHash,
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Activity ' + name + ' requested'});
                        }

                    } else {
                        console.log("geth report error: " + error);
                        sAlert.info('if not, report: ' + error,
                            {
                                timeout: 'none',
                                sAlertIcon: 'fa fa-info-circle',
                                sAlertTitle: 'Session password wrong, WiFi down or low credit?'
                            });
                    }
                });

            template.$('input[name=name]').val('');
        }
    }

});
