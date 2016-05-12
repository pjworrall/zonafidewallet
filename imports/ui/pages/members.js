/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './members.html';

Template.members.onRendered(function () {
    $('.tooltipped').tooltip();
});

Template.members.onCreated(function () {
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

Template.members.helpers({
   address() {

       var zone = ZidUserLocalData.findOne(
           Template.instance().data._id);

       return  zone.address;
   }
});

Template.members.events({

    'submit .add'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        zone.setMembers([zid], quorum,
            ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),

            function (error, obj) {
                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Zonafide Access Failure'});
                } else {
                    sAlert.info('member possibly set but callback not handling confirmation yet: ' + obj,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Developer Issue'});
                }
            });

    },

    'submit .check'(event, template) {
        // Prevent default browser form submit
        event.preventDefault();

        const zad = event.target.zad.value;
        const zid = event.target.zid.value;

        var Zone = template.Zone;
        var KeyStore = template.KeyStore;

        var zone = Zone.at(zad);

        // todo: quorum set hard at 1 for now
        const quorum = 1;

        zone.isMember([zid], ZonafideEnvironment.caller(KeyStore.getAddresses()[0]),

            //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

            function (error, obj) {
                if (error) {
                    sAlert.error('Report to Zonafide: ' + error,
                        {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Zonafide Access Failure'});
                } else {
                    if(obj) {
                        sAlert.info(zid + ' reported to be a member but full development of callback not complete: ' + obj,
                            {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Yes, a member'});
                    } else {
                    sAlert.info(zid + ' reported not a member but full development of callback not complete: ' + obj,
                        {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'No, not a member'});
                    }
                }
            });

    }

});