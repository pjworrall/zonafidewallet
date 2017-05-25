/**
 * Created by pjworrall on 04/04/2017.
 */

import {Activity} from './activity.js';


import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';

import lightwallet from 'eth-lightwallet';
import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';


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

        let _activity = new Activity();

        try {
            _activity.get(web3, "0x181a5d7bbfbcfe8a5334f6b289822b718cdca098");

            chai.assert(!_activity.isActive(), "Activity should have not been Active");

        } catch (error) {
            chai.assert(false, "error getting Activity from contract: " + error);
        }

    });

    it('should acknowledge an Activity', function (done) {

        let params = {
            from: keystore.getAddresses()[0],
            gas: ZonafideEnvironment.Gas,
            gasPrice: ZonafideEnvironment.GasPrice,
            data: ZonafideEnvironment.code // this isn't needed
        };

        let _activity = new Activity();
        _activity.get(web3, "0x7d5c4daa755a33fe12cac07793cb063c15c82212");

        _activity.acknowledge(web3,params, new Monitor());

        function Monitor() {
            this.completed = function (receipt) {
                expect(receipt).to.be.ok
                done();
            };
            this.error = function (error) {
                chai.assert(false, "error getting transaction receipt for Acknowledgement: " + error);
                done();
            }
        }

    });


});