/**
 * Created by pjworrall on 04/04/2017.
 */

import {Activity} from './activity.js';
import lightwallet from 'eth-lightwallet';
import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';


describe('Activity', function () {

    let seed = "foil unlock shy slice speed payment coral bring guard wheat grant upgrade",
        sender = "0x09d5043d675d5ca75ee7bb51691fcc44543faade",
        encpw = "testing",
        host = "http://zonafide.space:3090",
        signer = null,
        web3 = new Web3();

    let candidates = {
        created: {
            address: '0x181a5d7bbfbcfe8a5334f6b289822b718cdca098'
        },
        acknowledgers: {
            address: '',
            values: ['0xf76216c08976e36aa276580efa818ffc9235cefa']
        },
        acknowledged: {
            address: '0x450ccba3ad876e420febb6811de863a93f773762',
            values: ['0xf76216c08976e36aa276580efa818ffc9235cefa']
        },
        actioned: {
            address: ''
        },
        confirmed: {
            address: ''
        }
    };

    before(function () {

        lightwallet.keystore.deriveKeyFromPassword(encpw, function (pwerror, pwDerivedKey) {

            if (pwerror) {
                console.log(pwerror);
            } else {
                try {
                    signer = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);
                } catch (kserror) {
                    console.log(kserror1);
                }

            }

        });

        let web3Provider = new HookedWeb3Provider({
            host: host,
            transaction_signer: signer
        });

        web3.setProvider(web3Provider);
    });

    // this appears to give false positives because the web3 API doesn't check if address is correct when using contract.at()
    it('should report the Activity address', function () {

        let _activity = new Activity(web3, candidates.created.address);

        let _address = _activity.getAddress();

        chai.assert.strictEqual(candidates.created.address, _address, "Activity Address was incorrect");

    });

    it('should report status of Activity', function () {

        let _activity = new Activity(web3, candidates.created.address);

        let _bool = _activity.isActive(sender);

        console.log("z/ actioned: " + _bool);

        chai.assert.isFalse(_bool, "Activity was not expected to be Active");

    });

    it('should report Acknowledged', function () {

        let _activity = new Activity(web3, candidates.acknowledged.address);

        let acknowledgers = _activity.getAcknowledgers(sender);

        console.log("z/ acknowledgers: " + JSON.stringify(acknowledgers));

        chai.assert.strictEqual(acknowledgers[0], candidates.acknowledged.values[0], "Acknowledger was not as expected");

    });

    it('should report Activity Events', function (done) {

        let _activity = new Activity(web3, candidates.acknowledged.address);

        _activity.getEvents().then(
            function(result) {

                let acked = false;

                console.log("z/activity.tests.events then result: " + JSON.stringify(result));

                // check the content is as expected

                console.log("z/number of events: " + result.length);

                for(let i = 0 ; i < result.length ; i++) {
                        console.log("z/address: " + result[i].address);
                        console.log("z/event: " + result[i].event);

                        if(result[i].event === 'Acknowledged'){
                            acked = true;
                        }
                }

                // [{
                //     "address": "0x450ccba3ad876e420febb6811de863a93f773762",
                //     "blockHash": "0x8c909087ef8f7801c541df9c1d739efe6ccdb5f3dfc23ba4ea596989b301aa09",
                //     "blockNumber": 1031176,
                //     "logIndex": 0,
                //     "transactionHash": "0x81b928624d008e76d1c11c4cf2b45c468d3019bc3c6bbcd09cdb68d84827d420",
                //     "transactionIndex": 0,
                //     "event": "Acknowledged",
                //     "args": {"acknowledger": "0xf76216c08976e36aa276580efa818ffc9235cefa"}
                // }]

                chai.assert(acked, "Activity was not acknowledged.");

                done();
            },
            function(error) {
                chai.assert(false, "Activity Events failed to deliver on Promise: " + error);
                done();
            });

    });


});
