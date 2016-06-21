/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './settings.html';

Template.settings.onRendered(function() {
    $('.tooltipped').tooltip();
});

Template.settings.onCreated(function () {

    var ks = this.KeyStore = ZidStore.get();

    this.balance = new ReactiveVar();

    if (typeof ks != 'undefined') {
        // todo: this web3 instance should be instantiated once and used throughout the code!!!
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.balance.set(web3.eth.getBalance("0x09d5043d675d5ca75ee7bb51691fcc44543faade"));
        console.log("balance: " + this.balance.get());
    } else {
        sAlert.error('A ZID is not unlocked',
            {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Development Error'});
    }

});

Template.settings.helpers({
    balance() {
        return Template.instance().balance.get();
    }
});