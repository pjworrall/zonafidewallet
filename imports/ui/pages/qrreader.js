/**
 * Created by pjworrall on 21/05/2016.
 */

import { Template } from 'meteor/templating';

import "../../api/html5-qrcode/html5-qrcode.min.js";
import "../../api/html5-qrcode/jsqrcode-combined.min.js";

import './qrreader.html';

Template.qrreader.events({

    // ack might have to come back out into its own page
    'click #cameraOn'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        console.log('camera on..');

        $('#reader').html5_qrcode(function(data){
                // do something when code is read

                console.log("data: " + data);

                $('#read').html(data);

            },
            function(error){
                //show read errors

                console.log("error: " + error);
                $('#read_error').html(error);

            }, function(videoError){

                //the video stream could be opened
                console.log("videoError: " + error);
                $('#vid_error').html(videoError);
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