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
    //this is here because we could experiment with a drop down list of Zones
    zads() {
        return ZidUserLocalData.find({}, {
            sort: {_id: -1}
        });
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
        const description = {
            action: event.target.action.value,
            firstName: event.target.firstName.value,
            familyName: event.target.familyName.value,
            reference: event.target.reference.value,
            houseId: event.target.houseId.value,
            streetAddress: event.target.streetAddress.value,
            postCode: event.target.postCode.value
        };

        console.log("edit.events - description: " + JSON.stringify(description) + " :" + zid );

        var zone = Zone.at(zad);

        zone.action(JSON.stringify(description),zid,
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, obj) {
                //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                console.log("error: " + error + ", obj: " + obj);

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Zonafide Access Failure'});
                } else {
                    sAlert.info(zad + ' transaction id returned but callback not handling any form of confirmation (mined): ' + obj,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Actioned'});
                }
            });
    }

});

