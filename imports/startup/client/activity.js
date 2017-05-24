/**
 * Created by pjworrall on 04/04/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import {ZoneState} from '/imports/startup/client/globals.js';

function Activity(web3, name, owner, state) {

    // these arguments should be checked

    this.web3 = web3;
    // required from a record
    this.name = name;
    this.owner = owner;
    this.state = state;

    // smart contract instance from get or create
    this.contract = null;

    // proxy methods
    this.getAddress = function () {
        return this.contract.address;
    };

    this.getAcknowledgers = function () {
        return this.contract.getAcknowledgers({
            from: this.owner
        });
    };

    this.isActive = function () {
        return this.contract.isActive({
            from: this.owner
        });
    };

}

// Activity.prototype.getEvents = function () {
//
//     //todo: I think the caller should wrap the promise
//
//     // todo: the block criteria is going to have to be more accurate aotherwise it will take too long to resolve
//     let events = this.contract.allEvents({fromBlock: 0, toBlock: 'latest'});
//
//     return new Promise(function (resolve, reject) {
//
//         events.get((error, result) => {
//             if (error) {
//                 reject(Error(error));
//             } else {
//                 resolve(result);
//             }
//         });
//
//     });
//
// };
//
// todo: get a try/ catch in here
Activity.prototype.get = function (address) {

    let factory = null;
    try {
        factory = this.web3.eth.contract(ZonafideEnvironment.abi);
    } catch (error) {
        throw "failed to get contract factory: " + error;
    }

    try {
        this.contract = factory.at(address);
    } catch (error) {
        throw "factory failed to get contract:" + error;
    }

};
//
// Activity.prototype.new = function (web3, name, params, monitor) {
//
//     // todo: override gas value but skipped because estimated gas price is too low
//     // params.gas = ZonafideWeb3.getInstance().eth.estimateGas(params);
//     // override gasPrice
//     params.gasPrice = ZonafideWeb3.getGasPrice();
//
//     console.log("z/New activity params: " + JSON.stringify(params));
//
//     web3.eth.contract(ZonafideEnvironment.abi).new(params, newActivity);
//
//     function newActivity(error, contract) {
//         if (!error) {
//
//             if (typeof contract.address != 'undefined') {
//
//                 // I hope the name and params in the enclosing block is available to this function?
//                 this.contract = contract;
//                 this.owner = params.from;
//                 this.name = name;
//                 this.state = ZoneState.NEW;
//                 this.created = new Date();
//                 // this is here because I am not sure the creation transactionHash is available on subsequent instantiations
//                 this.creationTransactionHash = contract.transactionHash;
//
//                 console.log("z/ established activity address: " + JSON.stringify(this));
//                 monitor.completed(contract, this);
//
//             } else {
//
//                 console.log('z/ registering activity tx: ' + contract.transactionHash);
//                 monitor.requested(contract);
//
//             }
//
//         } else {
//             console.log('z/ encountered error: ' + error);
//             monitor.error(error);
//         }
//     }
//
// };


export {Activity} ;