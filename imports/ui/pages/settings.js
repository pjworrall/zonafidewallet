/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './settings.html';

Template.settings.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.settings.onCreated(function () {

    var ks = this.KeyStore = ZidStore.get();

    this.balance = new ReactiveVar();

    if (typeof ks != 'undefined') {
        // todo: this web3 instance should be instantiated once and used throughout the code!!!
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.balance.set(web3.eth.getBalance(ks.getAddresses()[0]));
    } else {
        sAlert.error('A ZID is not unlocked',
            {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Development Error'});
    }

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

    'submit .node'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const server = event.target.server.value;

        // todo: should check "server" is a valid url

        ZonafideDappData.update({document: "settings"},
            {
                document: "settings",
                server: server
            },
            // if document does not exist yet create it
            { upsert: true }
        );

    }

});