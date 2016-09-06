/**
 * Created by pjworrall on 21/05/2016.
 */

import { Template } from 'meteor/templating';
//import { QRCode } from 'meteor/steeve:jquery-qrcode';

import './code.html';

Template.code.onRendered(function () {

    $('#qrcode').qrcode({
        render: 'div',
        size: 400,
        text: Template.instance().data.address
    });

})

Template.code.events({

    'submit .remove'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        if (confirm('Are you sure?')) {

            const address = event.target.address.value;

            console.log("removing: " + address );

            //todo: small chance the zone might not exist but decided not to test because it is so unlikely

            ZidUserLocalData.remove({address: address});

            Router.go("list");

        }

    }
});

