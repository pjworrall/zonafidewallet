/**
 * Created by pjworrall on 04/05/2016.
 */

Session.set('lock', true);
Session.set('zid', false);

ZidStore = {

    set: function(keystore) {
        this.keystore = keystore;
    },

    get: function() {
        return this.keystore;
    }
}

