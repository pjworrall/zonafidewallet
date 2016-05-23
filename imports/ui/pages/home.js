/**
 * Created by pjworrall on 03/05/2016.
 */
import { Template } from 'meteor/templating';

import "../../api/html5-qrcode/html5-qrcode.js";

import './home.html';

Template.home.onCreated(function () {

    console.log("running onCreated..");

});

Template.home.events({

    // ack might have to come back out into its own page
    'click #cameraOn'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('camera on..');

        $('#reader').html5_qrcode(function(data){
                // do something when code is read

                console.log("data: " + data);

            },
            function(error){
                //show read errors

                console.log("error: " + error);

            }, function(videoError){

                //the video stream could be opened
                console.log("videoError: " + error);

            }
        );

    },

    'click #cameraOff'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('stopping camera use: called');

        $('#reader').html5_qrcode_stop();

    }

});

