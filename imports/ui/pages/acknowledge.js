/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './acknowledge.html';

Template.acknowledge.onRendered(function() {
    $('.tooltipped').tooltip();
});

Template.acknowledge.onCreated(function () {

    this.zad = new ReactiveVar('Provide Zone Address...');

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

Template.acknowledge.onCreated(function () {
   // redundant
});


Template.acknowledge.helpers({

    zad() {
        return  Template.instance().zad.get();
    }

});

Template.acknowledge.events({

    // ack might have to come back out into its own page
    'click #qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('qrscanner.events: called');

        $('#reader').html5_qrcode(function(data){
                // do something when code is read

                console.log("data: " + data);

                $('#reader').html5_qrcode_stop();

                template.zad.set(data);

            },
            function(error){
                //show read errors
                console.log("error: " + error);
            }, function(videoError){
                //the video stream could be opened
                console.log("videoError: " + error);
            }
        );
    },

    // ack might have to come back out into its own page
    'click #clipboard'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('clipboard.events: called');

    },

    // ack might have to come back out into its own page
    'click #acknowledge'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('acknowledge.events: called');

        const zad = event.target.zad.value;

        // todo: should test ZAD for validity and reject if not valid!!!

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        zone.setAcknowledgement(
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, obj) {
            //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Zonafide Access Failure'});
                } else {
                    sAlert.info(zad + ' transaction id returned but callback not handling any form of confirmation (mined): ' + obj,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Acknowledged'});
                }
            });
    }

});
