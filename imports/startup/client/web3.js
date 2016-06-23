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
    var provider;

    function createInstance() {

        web3 = new Web3();

        var node;
        var settings = ZonafideDappData.findOne({document: "settings"});

        if (settings && settings.server) {
            node = settings.server;
        } else {
            node = ZonafideEnvironment.Node;
        }

        provider =ZidStore.get();

        if (typeof provider != 'undefined') {

            var web3Provider = new HookedWeb3Provider({
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
        getInstance: function() {
            // todo: try/catch/throw?
            if (!web3) {
                web3 = createInstance();
            }
            return web3;
        },
        getFactory: function() {
            return this.getInstance().eth.contract(ZonafideEnvironment.abi);
        },
        getBalance: function() {
            return this.getInstance().eth.getBalance(
                    provider.getAddresses()[0]
                );
        },
        reset: function() {
                web3 = undefined;
        }
    }

})();