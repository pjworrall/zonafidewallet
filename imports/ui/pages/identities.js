/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

// todo : not sure this is needed
import  { ZidStore, SessionPasswordOveride } from '/imports/startup/client/globals.js';

import './identities.html';

Template.identities.onCreated(function () {

    console.log('.identities.onCreated: setting reactive vars');

    this.seeded = new ReactiveVar(false);
    this.passphrase = new ReactiveVar();

});

Template.identities.onRendered( function() {
    // this seems inconsistent with Meteor idiom

    // todo: adding the 0x prefix here is a workaround
    // until we understand what we are going to do with addresses

    if(Session.get('zid')) {

        $('#qrcode').qrcode({
            render: 'div',
            size: 400,
            text: '0x' + Session.get('zid')
        });

    }

});

Template.identities.helpers({

    zid() {

        if(!Session.get('zid')) {
            return Session.get('zid');
        } else {
            return '0x' + Session.get('zid');
        }

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
    'click .js-share'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: this will all go in a service component....eventually...

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: 'Get in the Zone with me. My Zonafide ID is ' + Session.get('zid'), // not supported on some apps (Facebook, Instagram)
            subject: 'My Zonafide ID', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: 'https://www.zonafide.net',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        };

        let onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        let onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    }


});


