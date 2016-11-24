/**
 * Created by pjworrall on 04/05/2016.
 */


// all this needs to migrate into a function avoid global namespace clashes!!!

// app wide session state
// todo: check what the impact of being limited to a browser tab might mean to behaviour
Session.set('lock', true);
Session.set('zid', false);


// a function to share the ether-lightwallet across the appl
let ZidStore = {

    set: function (keystore) {
        this.keystore = keystore;
    },

    get: function () {
        return this.keystore;
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

// this needs to be abstracted into a locale admin
let ZoneStateAction = {
    0: "Add the people you want to Acknowledge that this Activity is genuine.",
    1: "Share the Activity with those you want to Acknowledge it.",
    2: "Declare the party that the Activity will be with and provide brief details.",
    3: "Share the Activity with the other party and use it to prove it and you are genuine.",
    4: "This Activity has been Confirmed by the other party and is now obsolete.",
    5: "????..",
    6: "Unknown state..just abandon."
};

let ZoneStateSymbol = {
    0: "fa fa-plus-circle",
    1: "fa fa-circle-o-notch",
    2: "fa fa-circle-o",
    3: "fa fa-check-circle-o",
    4: "fa fa-check-circle",
    5: "fa fa-pause-circle",
    6: "fa fa-question-circle"
};


let ZoneState = {
    NEW: 0,
    MEMBERS: 1,
    ACKNOWLEDGED: 2,
    ACTIONED: 3,
    CONFIRMED: 4,
    PAUSE: 5,
    UNKNOWN: 6
};

// TODO: NOTE: !! current not used for QR Code rendering but here for reference

let QRCodeOptions = {
    // render method: 'canvas', 'image' or 'div'
    render: 'div',

    // version range somewhere in 1 .. 40
    minVersion: 1,
    maxVersion: 40,

    // error correction level: 'L', 'M', 'Q' or 'H'
    ecLevel: 'L',

    // offset in pixel if drawn onto existing canvas
    left: 0,
    top: 0,

    // size in pixel
    size: 200,

    // code color or image element
    fill: '#000',

    // background color or image element, null for transparent background
    background: null,

    // content
    text: 'no text',

    // corner radius relative to module width: 0.0 .. 0.5
    radius: 0,

    // quiet zone in modules
    quiet: 0,

    // modes
    // 0: normal
    // 1: label strip
    // 2: label box
    // 3: image strip
    // 4: image box
    mode: 0,

    mSize: 0.1,
    mPosX: 0.5,
    mPosY: 0.5,

    label: 'no label',
    fontname: 'sans',
    fontcolor: '#000',

    image: null
};

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
let NumberWithCommas = function () {
    return {
        convert: function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}();


export {
    ZidStore,
    ZidUserLocalData,
    ZidUserLocalPersonalData,
    ZonafideDappData,
    ZoneStateAction,
    NumberWithCommas,
    ZoneStateSymbol,
    ZoneState
};
