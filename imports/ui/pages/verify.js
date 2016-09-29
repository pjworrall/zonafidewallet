/**
 * Created by pjworrall on 15/09/2016.
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './verify.html';


Template.verify.onCreated(function consoleOnCreated() {

    this.ZoneFactory = ZonafideWeb3.getFactory();

    this.Zone = undefined;

    this.version = new ReactiveVar("...");

    this.isactive = new ReactiveVar("...");

    this.details = new ReactiveVar("...");

    this.zid = new ReactiveVar('');

    this.zad = new ReactiveVar('');

    this.member = new ReactiveVar("...");

    this.acknowledger = new ReactiveVar("...");


});

Template.verify.helpers({

    version() {
        return Template.instance().version.get();
    },
    isactive() {
        return Template.instance().isactive.get();
    },
    details() {
        return Template.instance().details.get();
    },
    member() {
        return Template.instance().member.get();
    },
    acknowledger() {
        return Template.instance().acknowledger.get();
    },
    zid() {
        return Template.instance().zid.get();
    },
    zad() {
        return Template.instance().zad.get();
    }
});

Template.verify.events({

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click #ZadQrScanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('ZadQrScanner.events: called');

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.zad.set(result.text);
                    }
                }
            }, $('#reader')
        );

    },

    // todo: this can be refactored out in some way. Duplicate in acknowledge.js .
    'click #ZidQrScanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('ZidQrScanner.events: called');

        // empty any previous reader for web qr scanning reset

        $('#reader').empty();

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.zid.set(result.text);
                    }
                }
            }, $('#reader')
        );

    },
    // todo: this can be refactored out in some way. Duplication!!
    'click #contactdb'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this call out eventually need to be cognisant of the quirks for the different platforms

        navigator.contacts.pickContact(function (contact) {

            if(contact.ims && contact.ims.length) {
                contact.ims.some( function(address) {
                    if(address.value.startsWith("ZID:")) {
                        var zid = address.value.split(":");
                        template.zid.set(zid[1]);
                        return true;
                    }
                });
            } else {
                sAlert.info("No ZID found",
                    {
                        timeout: 'none',
                        sAlertIcon: 'fa fa-info-circle',
                        sAlertTitle: 'Not found'
                    });
            }

        }, function (err) {
            sAlert.info("Error accessing contacts: " + err,
                {
                    timeout: 'none',
                    sAlertIcon: 'fa fa-info-circle',
                    sAlertTitle: 'Contacts error'
                });
        });

    },

    'submit .getZone'(event, template) {

        event.preventDefault();

        template.version.set("TBD");

        var zad = event.target.zad.value;

        template.Zone = template.ZoneFactory.at(zad);

        // todo: what if we don't get the zone dummy!

        var isactive = template.Zone.isActive() ? "Yes" : "No";
        template.isactive.set(isactive);

        var details = template.Zone.whatIsActive() || "No content yet";

        template.details.set(details);


    },

    'submit .memberCheck'(event, template) {

        event.preventDefault();

        // todo: decided to just ignore if there is no zone already established

        if (template.Zone) {

            var memberZid = event.target.member_zid.value;

            console.log("member_zid: " + memberZid);

            var member = template.Zone.isMember(memberZid) ? "Yes" : "No";

            template.member.set(member);

            var acknowledger = template.Zone.isAcknowledger(memberZid) ? "Yes" : "No";

            template.acknowledger.set(acknowledger);
        } else {
            sAlert.info("Provide a Zone first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Zone'});
        }

    },

    'submit .confirmZone'(event, template) {

        event.preventDefault();

        // todo: ignore when no Zone instantiated
        if (template.Zone) {

            template.Zone.confirm(ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]), function (error, tranHash) {
                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {
                            timeout: 'none',
                            sAlertTitle: 'Zonafide Access Failure'
                        });
                } else {
                    sAlert.info('A request to confirm has been made: ' + tranHash,
                        {timeout: 'none', sAlertTitle: 'Confirm Requested'});

                    ZoneTransactionReceipt.check(tranHash, ZonafideWeb3.getInstance(), function (error, receipt) {
                        if (error) {
                            sAlert.info('Could not confirm Zone: ' + error.toString(),
                                {
                                    timeout: 'none',
                                    sAlertTitle: 'Failed to  confirm Zone'
                                });
                        } else {
                            sAlert.info('Confirmed Zone at block: ' + receipt.blockNumber,
                                {
                                    timeout: 'none',
                                    sAlertTitle: 'Zone Confirmed'
                                });
                        }
                    });
                }
            });

        } else {
            sAlert.info("Provide a Zone first",
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No Zone'});
        }
    }

});