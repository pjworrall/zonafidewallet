/**
 * Created by pjworrall on 24/05/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';

function ActivityFactory(web3) {
    // check web3 validity?
    this.web3 = web3;
}

ActivityFactory.prototype.create = function (params, monitor) {

    console.log("z/ ActivityFactory.create params: " + JSON.stringify(params));

    this.web3.eth.contract(ZonafideEnvironment.abi).new(params, function (error, contract) {
        if (!error) {
            if (typeof contract.address != 'undefined') {
                console.log('z/ ActivityFactory.create received contract: ' + contract.address);
                monitor.completed(contract);
            } else {
                console.log('z/ ActivityFactory.create submitted transaction: ' + contract.transactionHash);
                monitor.requested(contract);
            }
        } else {
            console.log('z/ ActivityFactory.create encountered error: ' + error);
            monitor.error(error);
        }
    });

};

export {ActivityFactory} ;