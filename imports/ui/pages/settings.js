/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import lightwallet from 'eth-lightwallet';

import './settings.html';

Template.settings.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.settings.onCreated(function () {

    this.balance = new ReactiveVar();

    //this.balance.set(ZonafideWeb3.getBalance());

    this.balance.set("N/A");

});

Template.settings.helpers({
    balance() {
        return Template.instance().balance.get();
    },

    server() {

        var settings = ZonafideDappData.findOne({document: "settings"});

        if (settings && settings.server) {
            return settings.server;
        } else {
            return ZonafideEnvironment.Node;
        }
    }

});

Template.settings.events({

    'submit .setNode'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log(".setNode called...");

        const server = event.target.server.value;

        // todo: should check "server" is a valid url

        ZonafideDappData.update({document: "settings"},
            {
                document: "settings",
                server: server
            },
            // if document does not exist yet create it
            {upsert: true}
        );

        ZonafideWeb3.reset();

    },
    'click #getBalance'(event) {

        event.preventDefault();

        console.log(".getBalance called...");

        try {

            var balance = ZonafideWeb3.getBalance();

            var round = Math.round(balance).toString();

            Template.instance().balance.set(NumberWithCommas.convert(round));

        } catch (error) {
            sAlert.error(error.toString(),
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Could not retrieve balance'});
        }
    },

    'click #getSeed'() {

        var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
            alert('Your seed is: "' + ZidStore.get().getSeed(pwDerivedKey) + '". Please write it down.')
        })
    }


});