/**
 * Created by pjworrall on 04/05/2016.
 */

import  {i18n} from '/imports/startup/client/lang.js';

// update with deployments
let AppVersion = "0.2.9";

// all this needs to migrate into a function avoid global namespace clashes!!!

// app wide session state
// todo: check what the impact of being limited to a browser tab might mean to behaviour
Session.set('lock', true);
Session.set('zid', false);
Session.set('busy', 0);

// caution. over riding some security. for low security requirement environments only
let PasswordProvider = function (callback) {

    let settings = ZonafideDappData.findOne({document: "settings"});

    let password = null;
    if (settings && settings.sessionPassword) {
        password = prompt("Provide the Session Password");
    } else {
        password = SessionPasswordOveride;
    }

    callback(null, password);
};
// -- end caution

// for lower security requirements, session password override, use with caution
let SessionPasswordOveride = "caution";


// a function to share the ether-lightwallet across the appl
let ZidStore = {

    set: function (keystore, session) {
        session.set("keystore", this.keystore = keystore);
    },

    get: function () {
        return this.keystore;
    },

    destroy: function (session) {
        session.set("keystore", this.keystore = undefined);
    }
};

// the client side collections to store the state
let ZidUserLocalData = new Mongo.Collection('ZidUserLocalData', {connection: null});

let ZidUserLocalPersonalData = new Mongo.Collection('ZidUserLocalPersonalData', {connection: null});

let ZonafideDappData = new Mongo.Collection('ZonafideDappData', {connection: null});

// jeffm:local-persist used to persist the collection to browser store

// todo: need to revisit these parameters
let ZidUserLocalDataObserver = new LocalPersist(ZidUserLocalData, 'ZidUserLocalDataObserver',
    {                                     // options are optional!
        maxDocuments: 5,                   // maximum number of line items in cart
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('Please delete some of the obsolete Zones before saving more.');
        }
    });

let ZidUserLocalPersonalDataObserver = new LocalPersist(ZidUserLocalPersonalData, 'ZidUserLocalPersonalDataObserver',
    {                                     // options are optional!
        maxDocuments: 1,                  // max number of docs to store
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('You can only have one address record currently.');
        }
    });

let ZonafideDappDataObserver = new LocalPersist(ZonafideDappData, 'ZonafideDappDataObserver',
    {                                     // options are optional!
        maxDocuments: 1,                  // max number of docs to store
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('Restricted to storing one set of settings.');
        }
    });

let ZoneState = {
    NEW: 0,
    ACKNOWLEDGERS: 1,
    WAIT_ON_ACKNOWLEDGERS: 2,
    ACKNOWLEDGED: 3,
    ACTIONED: 4,
    WAIT_ON_CONFIRM: 5,
    CONFIRMED: 6,
    PAUSE: 7,
    UNKNOWN: 8
};


let ZoneStateAttributes = [
    {
        color: "#FFCE00",
        symbol: "fa fa-plus-circle",
        action: i18n.t("globals.acknowledgers")
    },
    {
        color: "#007849",
        symbol: "fa fa-circle-o",
        action: i18n.t("globals.share")
    },
    {
        color: "#727272",
        symbol: "fa fa-pause-circle",
        action: i18n.t("globals.ack.outstanding")
    },
    {
        color: "#0375B4",
        symbol: "fa fa-dot-circle-o",
        action: i18n.t("globals.action")
    },
    {
        color: "#FC4A1A",
        symbol: "fa fa-check-circle-o",
        action: i18n.t("globals.send")
    },
    {
        color: "#727272",
        symbol: "fa fa-pause-circle",
        action: i18n.t("globals.conf.outstanding")
    },
    {
        color: "#262228",
        symbol: "fa fa-check-circle",
        action: i18n.t("globals.confirmed")
    },
    {
        color: "#727272",
        symbol: "fa fa-pause-circle",
        action: i18n.t("globals.unknown")
    }, // unused
    {
        color: "#94618E",
        symbol: "fa fa-question-circle",
        action: i18n.t("globals.abandon")
    }
];

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
let NumberWithCommas = function () {
    return {
        convert: function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}();


// this has to use i18n
let ZoneAlertContent = {

    waiting: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'Waiting on network'
    },
    confirmed: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'Established on network'
    },
    inaccessible: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'WiFi down, low credit, wrong session password?'
    },
    max_records: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'Record limit'
    },
    not_found: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'Not found'
    },
    problem: {
        timeout: 'none',
        sAlertIcon: 'fa fa-info-circle',
        sAlertTitle: 'Problem encountered'
    }

};

export {
    AppVersion,
    PasswordProvider,
    SessionPasswordOveride,
    ZidStore,
    ZidUserLocalData,
    ZidUserLocalPersonalData,
    ZonafideDappData,
    ZoneStateAttributes,
    NumberWithCommas,
    ZoneState,
    ZoneAlertContent
};



