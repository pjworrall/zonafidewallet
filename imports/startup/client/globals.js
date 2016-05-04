/**
 * Created by pjworrall on 04/05/2016.
 */

Session.set('lock', true);

function ZidStoreWrapper() {
    function set() {
        this.keystore = KeyStore;
    }
}

ZidStore = new ZidStoreWrapper();

