/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

import  { ZidStore, SessionPasswordOveride, ZonafideDappData } from '/imports/startup/client/globals.js';

import './identities.html';

Template.identities.onCreated(function () {

    console.log('.identities.onCreated: setting reactive vars');

    this.seeded = new ReactiveVar(false);
    this.passphrase = new ReactiveVar();

});

Template.identities.helpers({

    seeded() {
        return Template.instance().seeded.get();
    },

    passphrase() {
        return Template.instance().passphrase.get();
    }

});


Template.identities.events({

    // todo: need to provide a better solution for C-PRNG
    'submit .seed'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        const extraEntropy = target.entropy.value;

        let passphrase = lightwallet.keystore.generateRandomSeed(extraEntropy);
        Template.instance().passphrase.set(passphrase);
        Template.instance().seeded.set(true);

    },
    'click .js-create'(event,template) {

        // Prevent default browser form submit
        event.preventDefault();

        // -- caution - lower security requirement use only

        // new Address should never use settings to determine Session Password use. Session Password use should
        // always be off. We'll just ensure any settings are deleted for now. Impact is that previous settings
        // are lost for all user.

        ZonafideDappData.remove({document: "settings"});

        // todo: check the JIRA exists to ensure app data is not leaked between different Addresses!!!!!

        // -- end of caution

        let passphrase = Template.instance().passphrase.get();

        lightwallet.keystore.deriveKeyFromPassword(SessionPasswordOveride, function (err, pwDerivedKey) {

            if (!err) {

                let keyStore = new lightwallet.keystore(
                    passphrase,
                    pwDerivedKey);

                // this seems to have to be done every time the keystore is instantiated.
                keyStore.generateNewAddress(pwDerivedKey, 1);

                ZidStore.set(keyStore);

                Router.go("list");


            } else {
                // todo: how to handle errors
                console.log("ERROR > .identities.events" + err);
            }

        });

    }


});


