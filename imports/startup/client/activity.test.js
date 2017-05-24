/**
 * Created by pjworrall on 04/04/2017.
 */

import {Activity} from './activity.js';

import lightwallet from 'eth-lightwallet';
import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';

import  {ZoneState} from '/imports/startup/client/globals.js';


describe('Activity', function () {

    this.timeout(0);

    let node = "http://zonafide.net:3090";
    let seed = "foil unlock shy slice speed payment coral bring guard wheat grant upgrade";
    let web3 = new Web3();
    let keystore = null;

    before('setup keystore', function (done) {

        lightwallet.keystore.deriveKeyFromPassword("test", function (err, pwDerivedKey) {

            if (err) {
                chai.assert(false, "password error");
            } else {

                try {
                    keystore = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);

                    keystore.generateNewAddress(pwDerivedKey, 1);

                    keystore.passwordProvider = function (callback) {
                        callback(null, "test");
                    };

                    web3.setProvider(new HookedWeb3Provider({
                        host: node,
                        transaction_signer: keystore
                    }));

                    done();

                } catch (err) {
                    chai.assert(false, "keystore creation error");
                }

            }

        });
    });

    beforeEach('keystore and web3 defined', function () {
        expect(keystore).to.be.ok;
        expect(web3).to.be.ok;
    } );

    it('should report server is accessible', function () {

        try {
            web3.net.listening;
        } catch (error) {
            chai.assert(false, "no access to the node");
        }

    });

    it('should report new Activity is inactive', function () {

        let owner = keystore.getAddresses()[0];

        let _activity = new Activity(web3, "test", owner, ZoneState.NEW);

        try {
            _activity.get("0x181a5d7bbfbcfe8a5334f6b289822b718cdca098");

            chai.assert(!_activity.isActive(), "Activity should have not been Active");

        } catch (error) {
            chai.assert(false, "error getting Activity from contract: " + error);
        }

    });


});