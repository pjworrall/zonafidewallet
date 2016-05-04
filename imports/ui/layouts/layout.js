/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../../startup/client/globals.js';

import "./layout.html";

Template.layout.helpers({

    locked() {
        return Session.get('lock');
    }

});