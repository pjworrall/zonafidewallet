/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';

import './home.html';

Template.home.onCreated(function () {

    console.log("running onCreated..");

});

Template.home.events({

    'click .js-about'() {
        Router.go("about");
    }

});

