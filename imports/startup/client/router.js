import { Router } from 'meteor/iron:router';

import '../../ui/pages';

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: '404',
    onBeforeAction: function () {
        // if the user has not unlocked their account, render the Unlock template
        var route = Router.current().route.path();

        // these can be public
        if( route === '/' || route === '/about' || route === '/identities') {
            this.next();
        } else if (!Session.get("unlocked")) {
                this.render('/');
        } else {
            this.next();
        }
    }
});

Router.route('/', {name: 'unlock'});

//Router.route('/unlock', {name: 'unlock'});

Router.route('/lock', {name: 'lock'});

Router.route('/list', {name: 'list'});

Router.route('/code/:address/name/:name',
    {
        name: 'code',
        data: function() { return this.params }
    });

Router.route('/action/:_id',
    {
        name: 'action',
        data: function() { return this.params }
    });

Router.route('/members/:_id',
    {
        name: 'members',
        data: function() { return this.params }
    });

Router.route('/confirm/:_id',
    {
        name: 'confirm',
        data: function() { return this.params }
    });

Router.route('/acknowledge', {name: 'acknowledge'});

Router.route('/identities', {name: 'identities'});

Router.route('/personal', {name: 'personal'});

Router.route('/settings', {name: 'settings'});

Router.route('/verify', {name: 'verify'});

Router.route('/about', {name: 'about'});
