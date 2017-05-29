/**
 * Created by pjworrall on 29/05/2017.
 */

import {Template} from 'meteor/templating';

import { ZidStore, ZidTransactionData } from '/imports/startup/client/globals.js';

import './transactions.html';

Template.transactions.helpers({

    tx() {
        return ZidTransactionData.find({
            from: "0x" + ZidStore.get().getAddresses()[0]
        }, {
            sort: {date: -1}
        });
    }

});