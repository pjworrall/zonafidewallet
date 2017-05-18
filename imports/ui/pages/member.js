/**
 * Created by pjworrall on 13/05/2017.
 */

import {Template} from 'meteor/templating';

import './member.html';

import  {ZidStore, ZidAddressData, ZonafideDappData, SessionPasswordOveride } from '/imports/startup/client/globals.js';

import lightwallet from 'eth-lightwallet';

Template.member.onCreated(function () {

    this.contact = ZidAddressData.findOne(this.data._id);

});

Template.member.helpers({
    name() {
        return Template.instance().data.contact.name;
    },

    address() {
        return Template.instance().data.contact.address;
    },
    color() {
        return "grey";
    }
});

Template.member.events({

    'click .js-pick'(event, template) {
        event.preventDefault();
        console.log("z/ click .js-pick");

        // check the integrity  of the address

        // get the target form input element from the parent view

        let inputElement = Template.parentData().zid;

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

                let record = template.data;

                let s1 = record.signature;
                // for testing with Blind Lemon (Jefferson) - first data element should be 95 but changed to 96 to cause failure
                // let s1 = {"r":{"type":"Buffer","data":[96,154,147,44,20,235,174,223,168,38,93,244,213,178,35,185,44,207,57,182,182,58,227,50,119,46,75,230,196,205,68,153]},"s":{"type":"Buffer","data":[71,218,223,155,251,44,103,132,99,123,167,155,141,127,36,109,12,168,16,132,233,140,232,50,157,202,96,59,107,75,194,87]},"v":28};

                // sign the contact object and add the signature to it
                let s2 = JSON.stringify(lightwallet.signing.signMsg(ZidStore.get(),
                    pwDerivedKey,
                    JSON.stringify(record.contact),
                    ZidStore.get().getAddresses()[0]));

                if(s1 === s2) {
                    // this was a real pain to figure out how to update content of input form on parent template!!
                    inputElement.set(record.contact.address);
                } else {
                    alert("Contact record Compromised");
                }

            } else {
                sAlert.error('Problem verifying signature of record..dev issue: ' + error, {timeout: 'none'});
            }

        });

    }

});