/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';
import  { ZonafideEnvironment } from '/imports/startup/client/ethereum.js';
import  { AppVersion } from '/imports/startup/client/globals.js';

import './about.html';

Template.about.helpers({

    contractVersion() {
        return ZonafideEnvironment.ContractVersion;
    },

    appVersion() {
        return  AppVersion;
    }

});