/**
 * Created by pjworrall on 26/01/2017.
 */

import  Polyglot from 'node-polyglot';

let i18n = new Polyglot();

// content for social share of Activity to Acknowledger
i18n.extend({
    "details.js-share.message": "Please Acknowledge this planned Activity: %{address} .",
    "details.js-share.subject": "Please Acknowledge my Activity.",
    "details.js-share.url": "Learn more at https://www.zonafide.net/a",             //todo: this should be to the explanation page for acknowledgerd

});

// content of social share of Activity to Verifier
i18n.extend({
    "details.js-send.message": "Please Verify this planned Activity: %{address} .",
    "details.js-send.subject": "Please Verify my Activity.",
    "details.js-send.url": "Learn more at https://www.zonafide.net/v",             //todo: this should be to the explanation page for verifier
});

// social share general text
i18n.extend({
    "social.share.title": "Share your Activity",
});


export {
    i18n
};



