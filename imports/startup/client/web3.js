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

ZonafideWeb3 = (function () {
    var web3;

    function createInstance() {
        return new Web3();
    }

    return {
        getInstance: function(node, provider) {
            // todo: try/catch/throw?

            if (!web3) {
                web3 = createInstance();
            }

            var web3Provider = new HookedWeb3Provider({
                host: node,
                transaction_signer: provider
            });

            web3.setProvider(web3Provider);

            return web3;

        }
    };

})();