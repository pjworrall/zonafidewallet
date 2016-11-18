/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// todo : not sure this is needed
import '../../startup/client/globals.js';

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

    // this unlocks a previously created KeyStore

    'click #unlock'(event,template) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const seed = $(template.find('input[name=passphrase]')).val();

        var password = prompt('Provide a Session Password', 'Password');

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive Key from password..dev issue', {timeout: 'none'});
            } else {

                try {
                    var Keystore = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);

                    // It seems every time we unlock we need to generate the address again.
                    // I would have thought the generation in the identity creation would be enough.
                    Keystore.generateNewAddress(pwDerivedKey, 1);

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