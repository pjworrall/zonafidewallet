/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './list.html';

Template.list.onCreated(function () {

    var ks = this.KeyStore = ZidStore.get();

    var web3;
    if (typeof ks != 'undefined') {
        web3 = ZonafideWeb3.getInstance(ZonafideEnvironment.Node, ks);
        this.Zone = web3.eth.contract(ZonafideEnvironment.abi);
    } else {
        sAlert.error('A ZID is not unlocked',
            {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Development Error'});
    }

});

Template.list.helpers({

    zads() {
        return ZidUserLocalData.find({}, {
            sort: {_id: -1}
        });
    }

});

Template.list.events({

    'submit .create'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('list.events: performing create event');

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        Zone.new(ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),
            function (error, contract) {
                if (!error) {

                    if (typeof contract.address != 'undefined') {
                        console.log('Confirmed. address: '
                            + contract.address
                            + ' transactionHash: '
                            + contract.transactionHash);

                        ZidUserLocalData.insert({
                            address: contract.address,
                            symbol: ZoneStateSymbols.new
                        });
                        // todo: got to refactor out the parameters here and across all alerts currently
                        // todo: I mean. shouldn't using the info method provide appropriate symbol?
                        sAlert.info(contract.address,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone established'});
                    } else {
                        sAlert.info('A Zone is being registered',
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Zone requested'});
                    }

                } else {
                    // todo: alert, geth call failed
                    console.log('geth callback error: ' + error);
                }
            });
    }

});
