/**
 * Created by pjworrall on 04/04/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import  {ZonafideWeb3} from '/imports/startup/client/web3.js';
import {ZoneState} from '/imports/startup/client/globals.js';

function Activity() {

    // required from a record. these are optional
    this.name = null;
    this.owner = null;
    this.state = null;

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
Activity.prototype.get = function (web3, address) {

    console.log("z/ get web3: " + web3);

    let factory = null;
    try {
        factory = web3.eth.contract(ZonafideEnvironment.abi);
    } catch (error) {
        throw "failed to get contract factory: " + error;
    }

    try {
        this.contract = factory.at(address);
    } catch (error) {
        throw "factory failed to get contract:" + error;
    }

};



export {Activity} ;