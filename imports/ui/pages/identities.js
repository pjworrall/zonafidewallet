/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './identities.html';

Template.identities.helpers({

    zid() {

        var keystore = ZidStore.get();

        if(typeof keystore != 'undefined' ){
            return keystore.getAddresses()[0];
        } else {
            // todo: alert something odd has happened
            return "Unexpectedly was not able to obtain ZID";
        }

    }

});
