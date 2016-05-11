import { Router } from 'meteor/iron:router';

import '../../ui/pages';

Router.configure({
    layoutTemplate: 'layout'
    //todo: use waitOn and loadingTemplate to update our Zones status;s
    //todo: when we load the page(s), like..
    //loadingTemplate: 'loading',
    //waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.route('/', {name: 'home'});

Router.route('/unlock', {name: 'unlock'});

Router.route('/list', {name: 'list'});

Router.route('/lock', {name: 'lock'});

Router.route('/acknowledge', {name: 'acknowledge'});

Router.route('/identities', {name: 'identities'});

Router.route('/personal', {name: 'personal'});

Router.route('/settings', {name: 'settings'});

Router.route('/about', {name: 'about'});
