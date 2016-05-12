/**
 * Created by pjworrall on 12/05/2016.
 */
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './menu.html';

Template.menu.helpers({

    locked() {
        return Session.get('lock');
    }

});