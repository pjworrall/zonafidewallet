/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// todo : not sure this is needed
import  { ZidStore } from '/imports/startup/client/globals.js';
import  {ZonafideDappData , PasswordProvider , SessionPasswordOveride } from '/imports/startup/client/globals.js';

import './unlock.html';

import lightwallet from 'eth-lightwallet';


Template.unlock.helpers({

    unlocked() {
        return Session.get('unlocked');
    },
    zid() {

        return Session.get('zid');
    }

});

Template.unlock.events({


    'click .js-about'(event){
        event.preventDefault();
        Router.go("about");
    },

    'click .js-unlock'(event,template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("click .js-unlock");

        // Get value from form element
        const seed = template.$('textarea').val();

        console.log(passphrase);


        // caution. over riding some security. for low security requirement environments only

        let settings = ZonafideDappData.findOne({document: "settings"});

        let password;
        if(settings && settings.sessionPassword ) {
            password = prompt("Provide a Session Password");
        } else {
            password = SessionPasswordOveride;
        }

        // -- end caution

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive Key from password..dev issue', {timeout: 'none'});
            } else {

                try {
                    let Keystore = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);

                    Keystore.generateNewAddress(pwDerivedKey, 1);

                    Keystore.passwordProvider = PasswordProvider;

                    // put the keystore into a global
                    ZidStore.set(Keystore);

                    Session.set('lock', false);

                    Session.set('zid', Keystore.getAddresses()[0]);

                    Session.set("unlocked", true);

                    // forward to lsit view

                    Router.go("list");

                } catch(err) {
                    sAlert.error('Was not able to obtain Key, is Passphrase correct?', {timeout: 'none'});
                }

            }

        });
    }
});