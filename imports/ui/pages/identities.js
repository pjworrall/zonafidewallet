/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

// todo : not sure this is needed
import '../../startup/client/globals.js';

import './identities.html';

Template.identities.onCreated(function () {

    console.log('.identities.onCreated: setting reactive vars');

    this.seeded = new ReactiveVar(false);
    this.passphrase = new ReactiveVar();

});

Template.identities.onRendered( function() {
    // this seems inconsistent with Meteor idiom

    if(Session.get('zid')) {

        $('#qrcode').qrcode({
            render: 'div',
            size: 400,
            text: Session.get('zid')
        });

    }

});

Template.identities.helpers({

    zid() {
        return Session.get('zid');
    },

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

        var passphrase = lightwallet.keystore.generateRandomSeed(extraEntropy);
        Template.instance().passphrase.set(passphrase);
        Template.instance().seeded.set(true);

    },
    'submit .store'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        const password = target.password.value;

        var passphrase = Template.instance().passphrase.get();

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            if (!err) {
                keyStore = new lightwallet.keystore(
                    passphrase,
                    pwDerivedKey);

                keyStore.generateNewAddress(pwDerivedKey, 1);

                ZidStore.set(keyStore);

                Session.set('zid',keyStore.getAddresses()[0]);

                Session.set('lock',false);


            } else {
                // todo: how to handle errors
                console.log("ERROR > .identities.events" + err);
            }

        });

    }

});


