/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../../api/html5-qrcode/html5-qrcode.min.js';
import '../../api/html5-qrcode/jsqrcode-combined.min.js';

import './members.html';

Template.members.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.members.onCreated(function () {
    // todo: what do we do if this call does not work ? Should be using exceptions
    this.Zone = ZonafideWeb3.getFactory();

    this.zad = new ReactiveVar('');

});

Template.members.helpers({
    address() {

        var zone = ZidUserLocalData.findOne(
            Template.instance().data._id);

        return zone.address;
    },
    zad() {
        return  Template.instance().zad.get();
    }
});

Template.members.events({

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

    'submit .add'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = template.Zone;

        var zone = Zone.at(zad);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        zone.setMembers([zid], quorum,
            ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),

            function (error, tranHash) {
                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Access Failure'
                        });
                } else {

                    sAlert.info('A request to add a member has been made: ' + tranHash,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Member Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not add member to Zone: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Failed to Add Member'
                                });
                        } else {
                            // careful here..using address property rather that unique id of record, should be same impact
                            ZidUserLocalData.update({address: zad}, {$set: {state: ZoneState.MEMBERS}});

                            sAlert.info('Member added to Zone at block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertIcon: 'fa fa-info-circle',
                                    sAlertTitle: 'Member Added'
                                });
                        }
                    });
                }
            });

    },

    'submit .check'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = template.Zone;

        var zone = Zone.at(zad);

        zone.isMember([zid], ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]),

            //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

            function (error, obj) {
                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertIcon: 'fa fa-exclamation-circle',
                            sAlertTitle: 'Zonafide Access Failure'
                        });
                } else {
                    if (obj) {
                        sAlert.info(zid + ' is a member of Zone ' + obj,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Yes, a member'});
                    } else {
                        sAlert.info( 'Zone ' + obj + 'report ' + zid + ' was not a member',
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No, not a member'});
                    }
                }
            });

    }

});