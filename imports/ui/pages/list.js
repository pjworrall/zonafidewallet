/**
 * Created by pjworrall on 03/05/2016.
 */

import { Template } from 'meteor/templating';

import './list.html';

Template.list.helpers({

    zads() {

        console.log('list.helpers called.');

        return ZidUserLocalData.find();
    }
});