import { Router } from 'meteor/iron:router';

import  { ZidStore } from '/imports/startup/client/globals.js';
import  { ZonafideWeb3 } from '/imports/startup/client/web3.js';

import '../../ui/pages';


Iron.Router.hooks.ZonafideAccessControl = function () {

     if( typeof ZidStore.get() === 'undefined' ) {
        this.render('/home');
    } else {
        this.next();
    }
};

Router.onBeforeAction('ZonafideAccessControl', {
    except: ['/', 'about', 'identities']
});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: '404'
});

Router.route('/', {name: 'home'});

Router.route('/lock', {name: 'lock'});

Router.route('/list', {name: 'list'});

Router.route('/details/:_id',
    {
        name: 'details',
        data: function () {
            return this.params
        },

        onBeforeAction: function () {
            console.log("Checking web3 connection...");

            try {
                if(ZonafideWeb3.isAlive()) {
                    console.log("all ok, on we go...");
                    this.render();
                } else {
                    console.log("connection reported it is not in service");
                    this.render("error");
                }
            } catch(error) {
                console.log("Network access point was inaccessible.");
                this.render("error");
            }

        }
    });

Router.route('/action/:_id',
    {
        name: 'action',
        data: function () {
            return this.params
        }
    });

Router.route('/members/:_id',
    {
        name: 'members',
        data: function () {
            return this.params
        }
    });

Router.route('/address', {name: 'address'});

Router.route('/acknowledge', {name: 'acknowledge'});

Router.route('/identities', {name: 'identities'});

Router.route('/personal', {name: 'personal'});

Router.route('/settings', {name: 'settings'});

Router.route('/verify', {name: 'verify'});

Router.route('/about', {name: 'about'});
