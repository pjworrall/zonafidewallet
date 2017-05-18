/**
 * Created by pjworrall on 16/05/2017.
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

import  {ZidStore, ZidAddressData, ZoneAlertContent, ZonafideDappData, SessionPasswordOveride } from '/imports/startup/client/globals.js';
import  {AddressRules} from '/imports/startup/client/validation.js';
import  {ZoneQRScanner} from '/imports/startup/client/qrscanner.js';


import './addressbook.html';

Template.addressbook.onCreated(function () {

    this.address = new ReactiveVar('');

});

// add check for address format
Template.addressbook.onRendered(function () {

    this.$('.js-add').validate({
        rules: {
            address: AddressRules.rules,
            name: {
                required: true,
            }
        },
        messages: {
            address: AddressRules.messages,
            name: {
                required: "Name required",
            }
        }
    });

});

Template.addressbook.helpers({

    record() {
        return ZidAddressData.find({
            zid: ZidStore.get().getAddresses()[0]
        }, {
            sort: {created: -1}
        });
    },
    address() {
        return Template.instance().address.get();
    }

});

Template.addressbook.events({

    // todo: please let this be the last time I cut and paste this before refactoring!!!
    'click .js-qrscanner'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-qrscanner');

        ZoneQRScanner.scan(function (error, result) {

                if (error) {
                    //todo: change to sAlert
                    alert("Scanning failed: " + error);
                } else {
                    if (!result.cancelled) {
                        // todo: cancelled does not exist on browser scanner so how do we handle that?
                        template.address.set(result.text);
                    }
                }
            }, $('#reader')
        );
    },

    'submit .js-add'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-add');

        let zid = ZidStore.get().getAddresses()[0] ;

        let count = ZidAddressData.find({
            zid: zid
        }).count();

        if (count >= 25) {
            sAlert.info('Currently only twenty five Activity records can be recorded', ZoneAlertContent.max_records);
            return;
        }

        let record = {
            zid: zid,
            contact: { address: template.$('input[name=address]').val(),
                    name: template.$('input[name=name]').val().trim()
                }
            };

        // caution. over riding some security. for low security requirement environments only

        let settings = ZonafideDappData.findOne({document: "settings"});

        let password = null;
        if (settings && settings.sessionPassword) {
            password = prompt("Provide the Session Password");
        } else {
            password = SessionPasswordOveride;
        }

        // -- end caution

        // sign the contact and add the signature

        lightwallet.keystore.deriveKeyFromPassword(password, function (error, pwDerivedKey) {

            if (!error) {

                let sig =  lightwallet.signing.signMsg(ZidStore.get(),
                    pwDerivedKey,
                    JSON.stringify(record.contact),
                    ZidStore.get().getAddresses()[0]);

               record.signature = JSON.stringify(sig);

                ZidAddressData.update(record,
                    { $set: record },
                    { upsert: true });

                template.$('input[name=name]').val('');
                template.$('input[name=address]').val('');

            } else {
                sAlert.error('Failed signing contact record..dev issue: ' + error, {timeout: 'none'});
            }

        });

    }

});