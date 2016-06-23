/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './list.html';

Template.list.onRendered(function() {
    $('.tooltipped').tooltip();
});

Template.list.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

});

Template.list.helpers({

    zads() {
        return ZidUserLocalData.find({}, {
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

        var count = ZidUserLocalData.find().count();

        if (count >= 5) {
            sAlert.info('Currently only five records of Zones can be remembered',
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone Record Limit'});
            return;

        } else {

            var Zone = template.Zone;

            Zone.new(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
                function (error, contract) {
                    if (!error) {

                        if (typeof contract.address != 'undefined') {
                            console.log('Confirmed. address: '
                                + contract.address
                                + ' transactionHash: '
                                + contract.transactionHash);

                            ZidUserLocalData.insert({
                                created: new Date(),
                                address: contract.address,
                                state: ZoneState.NEW
                            });

                            // todo: got to refactor out the parameters here and across all alerts currently
                            // todo: I mean. shouldn't using the info method provide appropriate symbol?
                            sAlert.info(contract.address,
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone established'});
                        } else {
                            sAlert.info('A Zone is being registered',
                                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone requested'});
                        }

                    } else {
                        // todo: alert, geth call failed
                        console.log('geth callback error: ' + error);
                    }
                });
        }
    }

});
