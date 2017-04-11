/**
 * Created by pjworrall on 26/01/2017.
 */

import  Polyglot from 'node-polyglot';

let i18n = new Polyglot();

// key creation
i18n.extend({
    "identities.js-create.confirm": "Have you taken note of your 12 word Key?",
});

// content for social share of Activity to Acknowledger
i18n.extend({
    "share.js-share.message": "Please Acknowledge this Activity: %{address} .",
    "share.js-share.subject": "Please Acknowledge my Activity.",
    "share.js-share.url": "Learn more at https://www.zonafide.net/a .",
    "share.js-share.title": "Share with Acknowledger"
});

// content of social share of Activity to Verifier
i18n.extend({
    "send.js-send.message": "Verify Activity: %{address}, %{instruction}",
    "send.js-send.subject": "Please Verify my Activity.",
    "send.js-send.url": "Learn more at https://www.zonafide.net/v .",
    "send.js-send.title": "Send to Verifier"
});

// content of social share of Activity to Verifier
i18n.extend({
    "share.js-send.message": "Verify Activity: %{address}, %{instruction}",
    "share.js-send.subject": "Please Verify my Activity.",
    "share.js-send.url": "Learn more at https://www.zonafide.net/v .",
    "share.js-send.title": "Share with Verifier"
});

// content for social share of Activity to Acknowledger
i18n.extend({
    "details.js-share.message": "Please Acknowledge this Activity: %{address} .",
    "details.js-share.subject": "Please Acknowledge my Activity.",
    "details.js-share.url": "Learn more at https://www.zonafide.net/a .",
    "details.js-share.title": "Share with Acknowledger"
});

// content of social share of Activity to Verifier
i18n.extend({
    "details.js-send.message": "Verify Activity: %{address}, %{instruction}",
    "details.js-send.subject": "Please Verify my Activity.",
    "details.js-send.url": "Learn more at https://www.zonafide.net/v .",
    "details.js-send.title": "Share with Verifier"
});

// content for social share of user Address
i18n.extend({
    "address.js-share.message": "Work together to prevent fraud. My Zonafide Address is %{address} ." ,
    "address.js-share.subject": "Let's Work Together!",
    "address.js-share.url": "Learn more at https://www.zonafide.net/z .",
    "address.js-share.title": "Share your Address"
});

// social share general text (obsolete?)
i18n.extend({
    "social.share.title": "Share your Activity",
});

// form validations
i18n.extend({
    "validators.address.owner": "Cannot be your Address",
    "validators.address.required": "You must enter an Address",
    "validators.address.minlength": "Too short for a valid Address",
    "validators.address.maxlength": "Too long for a valid Address",
    "validators.address.address": "Not a valid Address",
});

// home page social promotion
i18n.extend({
    "home.js-share.message": "Work together to prevent fraud. Accept Zonafide Activities ",
    "home.js-share.subject": "Protect my Activities from fraud.",
    "home.js-share.url": "@Zoneoftrust https://www.zonafide.net",
    "home.js-share.title": "Let Others Know"
});

// Activity state strap lines
i18n.extend({
    "globals.acknowledgers": "Add people to Acknowledge this Activity as genuine",
    "globals.share": "Share Activity and ask for Acknowledgements",
    "globals.action": "Declare the party this Activity is with and provide brief details",
    "globals.send": "Share the Activity with the other party. They will Verify and Confirm",
    "globals.confirmed": "This Activity has been Confirmed by the other party and is now obsolete",
    "globals.unknown": "????..",
    "globals.abandon": "Unknown state..just abandon",
    "globals.ack.outstanding": "Acknowledgement outstanding",
    "globals.conf.outstanding": "Verifier confirmation outstanding"
});


export {
    i18n
};



