/**
 * Created by pjworrall on 09/05/2016.
 *
 * ZonafideWeb3 is a singleton. First use will create
 * a single instance of the Web3 API.  Subsequent use
 * by other clients will be able to provide alternate
 * providers for the HookedWeb3Provider.
 *
 * Currently only tested with the Eth-Lightwallet KeyStore
 * provider.
 */


import HookedWeb3Provider from 'hooked-web3-provider';
import Web3 from 'web3';

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZidStore, ZonafideDappData} from '/imports/startup/client/globals.js';


let ZonafideWeb3 = (function () {
    let web3;
    let provider;
    let status = false;
    let cached = false;

    function createInstance() {

        web3 = new Web3();

        let node;
        let settings = ZonafideDappData.findOne({document: "settings"});

        if (settings && settings.server) {
            node = settings.server;
        } else {
            node = ZonafideEnvironment.Node;
        }

        provider = ZidStore.get();

        if (typeof provider != 'undefined') {

            let web3Provider = new HookedWeb3Provider({
                host: node,
                transaction_signer: provider
            });

            web3.setProvider(web3Provider);

        } else {
            sAlert.error('A ZID is not unlocked',
                {timeout: 'none', sAlertIcon: 'fa fa-exclamation-circle', sAlertTitle: 'Development Error'});
        }

        // todo: behaviour is a bit undefined here if there has been an error
        return web3;
    }

    return {
        getInstance: function () {
            // todo: try/catch/throw?
            if (!web3) {
                web3 = createInstance();
            }
            return web3;
        },
        getFactory: function () {
            return this.getInstance().eth.contract(ZonafideEnvironment.abi);
        },
        getBalance: function () {

            let balance = this.getInstance().eth.getBalance(provider.getAddresses()[0]);

            return this.getInstance().fromWei(balance, 'finney');
        },
        isAlive: function () {

            if (cached) {
                return status;
            } else {
                try {
                    status = this.getInstance().net.listening;
                } catch (error) {
                    status = false;
                    console.log(ZonafideEnvironment.Node + " inaccessible.");
                }
                cached = true;
            }

            return status;
        },
        reset: function () {
            web3 = undefined;
            cached = false;
        }
    }

})();

export {ZonafideWeb3};