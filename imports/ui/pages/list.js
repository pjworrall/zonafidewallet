/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

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

    'click .create a'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('list.events: performing create event');

        // if there are already five Zones let the user no that is the current limit

        var count = ZidUserLocalData.find({
                zid: ZidStore.get().getAddresses()[0]
            }).count();

        if (count >= 5) {
            sAlert.info('Currently only five records of Zones can be remembered',
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone Record Limit'});
            return;

        } else {

            var name = $(template.find('input[name=name]')).val();

            if (name === null || name.match(/^ *$/) !== null) {

                sAlert.info("Provide a name for the Activity",
                    {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Name required'});
                return;

            } else {
                // get rid of any unnecessary spaces
                name = name.trim();
                // reset the form
                $(template.find('input[name=name]')).val("");
            }

            var Zone = template.Zone;

            console.log("address: " + ZidStore.get().getAddresses()[0]);

            Zone.new(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
                function (error, contract) {
                    if (!error) {

                        if (typeof contract.address != 'undefined') {
                            console.log('Confirmed. address: '
                                + contract.address
                                + ' transactionHash: '
                                + contract.transactionHash);

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
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone established'});
                        } else {
                            sAlert.info('A Zone is being registered: ' + contract.transactionHash,
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone requested'});
                        }

                    } else {
                        console.log("geth report error: " + error);
                        sAlert.info('if not, report: ' + error,
                            {
                                timeout: 'none',
                                sAlertIcon: 'fa fa-info-circle',
                                sAlertTitle: 'Password wrong, WiFi down or low credit?'
                            });
                    }
                });
        }
    }

});
