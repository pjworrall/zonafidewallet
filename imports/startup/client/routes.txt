/**
 * Created by pjworrall on 03/05/2016.
 */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/layout.js';

import '../../ui/pages';

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("layout", {content: "home"});
    }
});

FlowRouter.route('/list', {
    action: function() {
        BlazeLayout.render("layout", {content: "list"});
    }
});

FlowRouter.route('/identities', {
    action: function() {
        BlazeLayout.render("layout", {content: "identities"});
    }
});

FlowRouter.route('/creation', {
    action: function() {
        BlazeLayout.render("layout", {content: "creation"});
    }
});

FlowRouter.route('/personal', {
    action: function() {
        BlazeLayout.render("layout", {content: "personal"});
    }
});

FlowRouter.route('/acknowledge', {
    action: function() {
        BlazeLayout.render("layout", {content: "acknowledge"});
    }
});

FlowRouter.route('/edit', {
    action: function() {
        BlazeLayout.render("layout", {content: "edit"});
    }
});

FlowRouter.route('/about', {
    action: function() {
        BlazeLayout.render("layout", {content: "about"});
    }
});

FlowRouter.route('/unlock', {
    action: function() {
        BlazeLayout.render("layout", {content: "unlock"});
    }
});

FlowRouter.route('/lock', {
    action: function() {
        BlazeLayout.render("layout", {content: "lock"});
    }
});

FlowRouter.route('/members', {
    action: function() {
        BlazeLayout.render("layout", {content: "members"});
    }
});