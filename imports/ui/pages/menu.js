/**
 * Created by pjworrall on 12/05/2016.
 */
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import  { ZidStore } from '/imports/startup/client/globals.js';

import './menu.html';

Template.menu.onRendered(function () {
    $('.tooltipped').tooltip();

    // to make bootstrap menu close when menu item chosen
    $(document).on('click','.navbar-collapse',function(e) {
        if( $(e.target).is('i') || $(e.target).is('a') ) {

            $(this).collapse('hide');
        }
    });

});


Template.menu.helpers({

    keystore() {
        return Session.get("keystore");
    }

});

Template.menu.events({

    'click .js-lock'(event) {

        console.log("click .js-lock");

        // Prevent default browser form submit
        event.preventDefault();

        ZidStore.destroy(Session);

        Router.go("/");

    }

});