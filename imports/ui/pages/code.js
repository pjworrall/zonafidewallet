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