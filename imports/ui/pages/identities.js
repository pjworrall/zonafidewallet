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

                // this seems to have to be done every time the keystore is instantiated.
                keyStore.generateNewAddress(pwDerivedKey, 1);

                console.log("new primary address: " + keyStore.getAddresses()[0] );

                ZidStore.set(keyStore);

                Session.set('zid',keyStore.getAddresses()[0]);

                Session.set('unlocked',true);

                Router.go("list");


            } else {
                // todo: how to handle errors
                console.log("ERROR > .identities.events" + err);
            }

        });

    },
    'submit .share'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this will all go in a service component....eventually...

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
            message: 'Get in the Zone with me. My Zonafide ID is ' + Session.get('zid'), // not supported on some apps (Facebook, Instagram)
            subject: 'My Zonafide ID', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        var onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }


});


