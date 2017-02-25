/**
 * Created by pjworrall on 25/02/2017.
 */

import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';
import lightwallet from 'eth-lightwallet';

describe('web3', function () {


    describe('web3.eth.getBalance', function () {

        /*
         I don't really understand how to control the thread of execution. The tests report
         twice because the lightwallet call returns before the callback does. I breifly
         looked at promise and callback and reflected advice but they still didn't address
         the case we had here.
         */

        it('should be able to get a balance', function (done) {
            // Charlie test see being used
            let seed = "foil unlock shy slice speed payment coral bring guard wheat grant upgrade";
            let pw = "poopoo";

            let callback = function (error, pwDerivedKey) {

                if (!error) {
                    let keyStore = new lightwallet.keystore(
                        seed,
                        pwDerivedKey);

                    keyStore.generateNewAddress(pwDerivedKey, 1);

                    let web3 = new Web3();

                    web3.setProvider(new HookedWeb3Provider({
                        host: "http://zonafide.net:3090",
                        transaction_signer: keyStore
                    }));

                    let balance = web3.eth.getBalance("0x09d5043d675d5ca75ee7bb51691fcc44543faade");

                    //chai.assert((balance > 0),
                    //  'failed to create a key store object');

                    // use of done() callback here as advised by Mocha
                    if (balance > 0) {
                        done();
                    } else {
                        done("balance not correct");
                    }

                } else {
                    done("failed to derive key: " + error);
                }

            };

            lightwallet.keystore.deriveKeyFromPassword(pw, callback);

        })

    });


});