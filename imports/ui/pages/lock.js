/**
 * Created by pjworrall on 04/05/2016.
 */

import './lock.html';

import  { ZidStore } from '/imports/startup/client/globals.js';

Template.lock.events({


    'click .js-lock'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // Iron Router will notice these variable are not set and route accordingly
        // No need to route here

        // todo: hate this is two steps but no time to find a better way
        ZidStore.set('undefined');
        // todo: should look into invalidating the whole Meteor session
        Session.set('unlocked',false);
        Session.set('zid',false);


    }

});