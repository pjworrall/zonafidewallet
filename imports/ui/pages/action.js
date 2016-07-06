/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';

import './action.html';

Template.action.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

});

Template.action.helpers({

    address() {

        var zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return  zone.address;
    }

});

Template.action.events({

    'submit .edit'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('edit.events: performing edit event');

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        // this has to be the setting of details
        // collect key form values and put then into an object
        // get the counterpart ready for use with

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        /*
         todo: this has to be encrypted with the counter party ZID
         */
        var description = {
            action: event.target.action.value,
            reference: event.target.reference.value
        };

        const includePersonalDetails = event.target.details.checked;

        console.log("includePersonalDetails: " + includePersonalDetails);

        if (includePersonalDetails) {

            var pd = ZidUserLocalPersonalData.findOne();

            // todo: this should only run if pd is not null or undefined
            if (pd) {
                description = {
                    action: description.action,
                    reference: description.reference,
                    firstName: pd.firstName,
                    familyName: pd.familyName,
                    houseId: pd.houseId,
                    streetAddress: pd.streetAddress,
                    postCode: pd.postCode
                }
            } else {
                sAlert.info("We didn't find any personal details to use. Provide some and try again.",
                    {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No personal details'});
                return;
            }
        }

        var zone = Zone.at(zad);

        zone.action(JSON.stringify(description), zid,
            ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),
            function (error, tranHash) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                console.log("error: " + error + ", obj: " + tranHash);

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Access Failure'

                        });
                } else {

                    sAlert.info('A request to action a Zone has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone Action Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not action Zone: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to Action Zone'
                                });
                        } else {
                            // watchout, using address property and not record id
                            ZidUserLocalData.update({address : zad},{$set:{state : ZoneState.ACTIONED}});

                            sAlert.info('Zone actioned at block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Zone Actioned'
                                });
                        }
                    });

                }
            });
    }

});

