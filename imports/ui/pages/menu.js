/**
 * Created by pjworrall on 12/05/2016.
 */
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './menu.html';

Template.menu.onRendered(function () {
    //$('.tooltipped').tooltip();

    console.log("setting up navbar close on click...");

    // to make bootstrap menu close when menu item chosen
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });

});


Template.menu.helpers({

    locked() {
        return Session.get('lock');
    }

});