/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import HookedWeb3Provider from 'hooked-web3-provider';
import lightwallet from 'eth-lightwallet';
import Web3API from 'web3';

import './acknowledge.html';

var Gas = 3000000;
var GasPrice = 18000000010;

var abi = [{
    "constant": true,
    "inputs": [],
    "name": "active",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "quorum",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_description", "type": "string"}, {"name": "_serviceProvider", "type": "address"}],
    "name": "action",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isActive",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"constant": false, "inputs": [], "name": "kill", "outputs": [], "type": "function"}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "members",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "whatIsActive",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "confirm",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "description",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "serviceProvider",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "acknowledgers",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "isMember",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "setAcknowledgement",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "isAcknowledger",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"constant": false, "inputs": [], "name": "revoke", "outputs": [], "type": "function"}, {
    "constant": false,
    "inputs": [{"name": "_members", "type": "address[]"}, {"name": "_quorum", "type": "uint8"}],
    "name": "setMembers",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isQuorum",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"inputs": [], "type": "constructor"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "acknowledger", "type": "address"}],
    "name": "Acknowledge",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "description", "type": "string"}, {
        "indexed": false,
        "name": "serviceProvider",
        "type": "address"
    }],
    "name": "Action",
    "type": "event"
}];

var Web3 = new Web3API();
var ethClient = 'http://192.168.1.51:1166';

function setWeb3Provider(keystore) {

    var web3Provider = new HookedWeb3Provider({
        host: ethClient,
        transaction_signer: keystore
    });

    Web3.setProvider(web3Provider);

}

Template.acknowledge.onCreated(function () {

    console.log('.acknowledge.onCreated: setting reactive vars');

    this.result = new ReactiveVar();

});


Template.acknowledge.helpers({

    result() {
        return Template.instance().result.get();
    }

});

Template.acknowledge.events({

    'submit .acknowledge'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('acknowledge.events: called');

        // todo: all this stuff should be refactored out into a service class
        var zoneFactory = Web3.eth.contract(abi);

        // set the Web3 provider
        var keyStore = ZidStore.get();

        if (typeof keyStore != 'undefined') {
            setWeb3Provider(keyStore);
        } else {
            // todo: alert problem with setting Web3 provider
            console.log('geth callback error: ');
        }

        const zad = event.target.zad.value;

        var zone = zoneFactory.at(zad);

        zone.setAcknowledgement(
            {
                from: Session.get('zid'),
                gas: Gas,
                gasPrice: GasPrice
            },
            function (err, obj) {

                if (err) {
                    console.log("ERROR - acknowledge.events: " + err);
                    Session.set('result', "something unexpected happened, sorry!");
                } else {
                    console.log("INFO - acknowledge.events: " + obj);
                    Template.instance().result.set(obj);
                }

            });
    }

});

