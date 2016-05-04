/**
 * Created by pjworrall on 04/05/2016.
 */

Session.set('lock', true);

ZidStore = {
    keystore: 'undefined',

    set: function(keystore) {
        this.keystore = keystore;
    },

    get: function() {
        return this.keystore;
    }
}

