/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';
import  {Identities} from '/imports/startup/client/validation.js';

import  { ZidStore, SessionPasswordOveride, ZonafideDappData } from '/imports/startup/client/globals.js';

import './identities.html';

Template.identities.onCreated(function () {

    this.seeded = new ReactiveVar(false);
    this.mnemonic = new ReactiveVar();

});

Template.identities.onRendered(function () {

    this.$('.js-seed').validate({
        rules: {
            entropy: Identities.rules
        },
        messages: {
            entropy: Identities.messages
        }
    });
});

Template.identities.helpers({

    seeded() {
        return Template.instance().seeded.get();
    },

    mnemonic() {
        return Template.instance().mnemonic.get();
    }

});


Template.identities.events({

    // todo: need to provide a better solution for C-PRNG
    'submit .js-seed'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        const extraEntropy = target.entropy.value;

        let mnemonic = lightwallet.keystore.generateRandomSeed(extraEntropy);
        Template.instance().mnemonic.set(mnemonic);
        Template.instance().seeded.set(true);

    },
    'click .js-create'(event,template) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log("click .js-create");

        // -- caution - lower security requirement use only

        // new Address should never use settings to determine Session Password use. Session Password use should
        // always be off. We'll just ensure any settings are deleted for now. Impact is that previous settings
        // are lost for all user.

        ZonafideDappData.remove({document: "settings"});

        // todo: check the JIRA exists to ensure app data is not leaked between different Addresses!!!!!

        // -- end of caution

        let mnemonic = Template.instance().mnemonic.get();

        lightwallet.keystore.deriveKeyFromPassword(SessionPasswordOveride, function (err, pwDerivedKey) {

            if (!err) {

                let keyStore = new lightwallet.keystore(
                    mnemonic,
                    pwDerivedKey);

                // this seems to have to be done every time the keystore is instantiated.
                keyStore.generateNewAddress(pwDerivedKey, 1);

                ZidStore.set(keyStore,Session);

                Router.go("list");


            } else {
                // todo: how to handle errors
                console.log("Error instantiating new keystore from new key mnemonic" + err);
            }

        });

    }


});


