/**
 * Created by pjworrall on 25/07/2016.
 */

/**
 *
 * Decides on which QR Scanner technique to use and scans on mobile or browser
 *
 **/

ZoneQRScanner = (function () {

    return {

        scan: function (callback,reader) {

            if (Meteor.isCordova) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        callback(false,result);
                    },
                    function (error) {
                        callback(error,false);
                    },
                    {
                        "preferFrontCamera" : false, // iOS and Android
                        "showFlipCameraButton" : true, // iOS and Android
                        "prompt" : "Place a barcode inside the scan area", // supported on Android only
                        "formats" : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                       // "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                    }
                );
            } else {

                reader.html5_qrcode( function(data){

                        reader.html5_qrcode_stop();

                        var result = new Object();
                        result.text = data;
                        callback(false,result);

                    }, function(error){
                        // todo: have to work out what to do because throwing error's appear
                        // to be a frequent thing to do with the component.
                        // just logging and ignoring for now
                        console.log("html5_qrcode reports error: " + error);
                        // callback(error,false);
                    }, function(videoError){
                        callback(videoError,false);
                    }
                );
            }

        }
    }
})();