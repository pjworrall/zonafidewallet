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

    locked() {
        return Session.get('lock');
    },
    zid() {

        return Session.get('zid');
    }

});

Template.unlock.events({

    // this unlocks a previously created KeyStore

    'submit .unlock'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const seed = target.seed.value;

        //todo: need to collect this from user, maybe put in session or something safer
        var password = 'daytona';

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (err) {
                sAlert.error('Failed to derive key from password..dev issue', {timeout: 'none'});
            } else {

                try {
                    var Keystore = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);

                    // the parameter 1 is the number of addresses in the HD wallet to create. We only need 1 currently.
                    Keystore.generateNewAddress(pwDerivedKey, 1);

                    // put the keystore into a global
                    ZidStore.set(Keystore);

                    // todo: I am not sure lock is redundant as I can alternatively test for zid
                    Session.set('lock', false);

                    Session.set('zid', Keystore.getAddresses()[0]);

                    // forward to lsit view

                    Router.go("list");

                } catch(err) {
                    sAlert.error('Was not able to obtain keystore, is passphrase correct?', {timeout: 'none'});
                }

            }

        });
    }
});