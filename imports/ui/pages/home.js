/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import  {ZidStore, ZonafideDappData, AppVersion , PasswordProvider , SessionPasswordOveride } from '/imports/startup/client/globals.js';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  {i18n} from '/imports/startup/client/lang.js';
import './home.html';

import lightwallet from 'eth-lightwallet';


Template.home.helpers({

    contractVersion() {
        return ZonafideEnvironment.ContractVersion;
    },

    appVersion() {
        return  AppVersion;
    },

    zid() {

        return Session.get('zid');
    }

});

Template.home.events({


    'click .js-about'(event){
        event.preventDefault();
        Router.go("about");
    },
    'click .js-share'(event, template) {

        // Prevent default browser form submit
        event.preventDefault();

        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        let options = {
            message: i18n.t("home.js-share.message",{ address: template.address} ), // not supported on some apps (Facebook, Instagram)
            subject: i18n.t("home.js-share.subject"), // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: i18n.t("home.js-share.url"),
            chooserTitle: i18n.t("home.js-share.title") // Android only, you can override the default share sheet title
        };

        // todo: need to improve this
        let onSuccess = function (result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        let onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

    },

    'click .js-unlock'(event,template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log("click .js-unlock");

        // Get value from form element
        const seed = template.$('input[name=key]').val();

        // caution. over riding some security. for low security requirement environments only

        let settings = ZonafideDappData.findOne({document: "settings"});

        let password = null;
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
                    ZidStore.set(Keystore, Session);

                    // forward to list view

                    Router.go("list");

                } catch(err) {
                    sAlert.error('Was not able to obtain Key, is Key correct?', {timeout: 'none'});
                }

            }

        });
    }
});