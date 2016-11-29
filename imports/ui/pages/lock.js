/**
 * Created by pjworrall on 04/05/2016.
 */

import './lock.html';

import  { ZidStore } from '/imports/startup/client/globals.js';

Template.lock.events({


    'click .js-lock'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // todo: hate this is two steps but no time to find a better way
        ZidStore.set('undefined');
        Session.set("unlocked",false);


    }

});