/**
 * Created by pjworrall on 24/05/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';

import lightwallet from 'eth-lightwallet';
import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';

import {ActivityFactory} from './activityfactory.js';

describe('ActivityFactory', function () {

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
    });

    it('should create an Activity', function (done) {

        let params = {
            from: keystore.getAddresses()[0],
            gas: ZonafideEnvironment.Gas,
            gasPrice: ZonafideEnvironment.GasPrice,
            data: ZonafideEnvironment.code
        };

        let _activity = new ActivityFactory(web3);

        _activity.create(params, new Monitor());

        function Monitor() {
            this.completed = function (contract) {
                expect(contract.address).to.be.ok
                done();
            };
            this.requested = function (contract) {
                expect(contract.transactionHash).to.be.ok
            };
            this.error = function (error) {
                chai.assert(false, "error creating contract for Activity: " + error);
                done()
            }
        }

    });


});