/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';

import './action.html';

Template.action.onCreated(function () {

    var ks = this.KeyStore = ZidStore.get();

    var web3;
    if (typeof ks != 'undefined') {
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.Zone = web3.eth.contract(ZonafideEnvironment.abi);
    } else {
        sAlert.error('A ZID is not unlocked',
            {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Development Error'});
    }

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
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, obj) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                console.log("error: " + error + ", obj: " + obj);

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Access Failure'
                        });
                } else {
                    // watchout, using address property and not record id
                    ZidUserLocalData.update({address : zad},{$set:{state : ZoneState.ACTIONED}});

                    sAlert.info(zad + ' transaction id returned but callback not handling any form of confirmation (mined): ' + obj,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Actioned'});
                }
            });
    }

});

