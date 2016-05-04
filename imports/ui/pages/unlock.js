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

        return "this will be the ZID when I figure out how to do it well"
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

        console.log("getting credentials with: " + password + "/" + seed);

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (!err) {

                var Keystore = new lightwallet.keystore(
                    seed,
                    pwDerivedKey);

                // the parameter 1 is the number of addresses in the HD wallet to create. We only need 1 currently.
                Keystore.generateNewAddress(pwDerivedKey, 1);

                // put the keystore into a global
                ZidStore.set(Keystore);

                Session.set('lock',false);

            } else {
                console.log(".unlock.events: " + "lightwallet failed to get keystore");
                // todo: put some kind of alert here
            }

        });
    }
});