/**
 * Created by pjworrall on 03/05/2016.
 */
import {Template} from 'meteor/templating';

import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZidStore, ZidUserLocalData, ZoneState, ZoneAlertContent} from '/imports/startup/client/globals.js';

import './list.html';

Template.list.onCreated(function () {

    // todo: what do we do if this call does not work ? Should be using exceptions
    this.ZoneFactory = ZonafideWeb3.getFactory();

});

Template.list.onRendered(function () {

    this.$('.js-create').validate({
        rules: {
            name: {
                required: true,
            }
        },
        messages: {
            name: {
                required: "You must provide a name",
            }
        }
    });

});

Template.list.helpers({

    zads() {
        return ZidUserLocalData.find({
            zid: ZidStore.get().getAddresses()[0]
        }, {
            sort: {created: -1}
        });
    }

});

Template.list.events({

    'submit .js-create'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        console.log('click .js-create');

        // if there are already five Zones let the user no that is the current limit

        let count = ZidUserLocalData.find({
            zid: ZidStore.get().getAddresses()[0]
        }).count();

        if (count >= 5) {
            sAlert.info('Currently only five Activity records can be recorded', ZoneAlertContent.max_records);
            return;
        }

        let name = template.$('input[name=name]').val();
        name = name.trim();

        let busyQ = Session.get('busy');
        Session.set('busy', (busyQ + 1));

        let ZoneFactory = template.ZoneFactory;

        let params = ZonafideEnvironment.caller(ZidStore.get().getAddresses()[0]);
        // Estimate of gas usage for creation of contract
        
        // todo: override gas value but skipped because estimated gas price is too low
        // params.gas = ZonafideWeb3.getInstance().eth.estimateGas(params);

        console.log("z/ create - gas estimate: " + params.gas);
        // override gasPrice
        params.gasPrice = ZonafideWeb3.getGasPrice();

        ZoneFactory.new(params, function (error, contract) {
                if (!error) {

                    if (typeof contract.address != 'undefined') {

                        ZidUserLocalData.insert({
                            zid: ZidStore.get().getAddresses()[0],
                            created: new Date(),
                            address: contract.address,
                            state: ZoneState.NEW,
                            name: name
                        });

                        sAlert.info("Created Activity: " + name, ZoneAlertContent.confirmed);

                        Session.set('busy', Session.get('busy') - 1);

                    } else {
                        sAlert.info('Registering Activity', ZoneAlertContent.waiting);

                    }

                } else {
                    sAlert.info('Encountered error: ' + error, ZoneAlertContent.inaccessible);
                    Session.set('busy', Session.get('busy') - 1);
                }
            });

        template.$('input[name=name]').val('');

    }

});
