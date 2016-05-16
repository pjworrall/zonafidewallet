/**
 * Created by pjworrall on 04/05/2016.
 */


// all this needs to migrate into a function avoid global namespace clashes!!!

// app wide session state
// todo: check what the impact of being limited to a browser tab might mean to behaviour
Session.set('lock', true);
Session.set('zid', false);


// a function to share the ether-lightwallet across the app
ZidStore = {

    set: function (keystore) {
        this.keystore = keystore;
    },

    get: function () {
        return this.keystore;
    }
};

// the client side collections to store the state
ZidUserLocalData = new Mongo.Collection('ZidUserLocalData', {connection: null});

ZidUserLocalPersonalData = new Mongo.Collection('ZidUserLocalPersonalData', {connection: null});

// jeffm:local-persist used to persist the collection to browser store

// todo: need to revisit these parameters
ZidUserLocalDataObserver = new LocalPersist(ZidUserLocalData, 'ZidUserLocalDataObserver',
    {                                     // options are optional!
        maxDocuments: 5,                   // maximum number of line items in cart
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('Please delete some of the obsolete Zones before saving more.');
        }
    });

ZidUserLocalPersonalDataObserver = new LocalPersist(ZidUserLocalPersonalData, 'ZidUserLocalPersonalDataObserver',
    {                                     // options are optional!
        maxDocuments: 1,                  // max number of docs to store
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('You can only have one address record currently.');
        }
    });

ZoneStateSymbols = {
    new: 'fa fa-plus-circle',
    members: 'fa fa-circle-o-notch',
    acknowledged: 'fa fa-circle-o',
    actioned: 'fa fa-check-circle-o',
    confirmed: 'fa fa-check-circle',
    pause: 'fa fa-pause-circle',
    unknown: 'fa fa-question-circle'
};