/**
 * Created by pjworrall on 04/04/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';
import {ZidTransactionData} from '/imports/startup/client/globals.js';

import  {ZoneTransactionReceipt} from '/imports/startup/client/receipt.js';

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

Activity.prototype.acknowledge = function (web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?

    this.contract.setAcknowledgement(params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // todo: this need to migrate from receipt to events

            monitor.requested(tranHash);

            // todo: and refactor out ZoneTransactionReceipt because it is duplicate everywhere

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {

                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Acknowledge Activity",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });

        }

    });


};

Activity.prototype.addAcknowledger = function (acknowledgers, quorum, web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?
    this.contract.setMembers(acknowledgers, quorum, params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // this need to migrate from receipt to events

            monitor.requested(tranHash);

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {

                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Add Acknowledger",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });

        }

    });


};

Activity.prototype.action = function (instructionHash, verifier, web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?
    this.contract.action(instructionHash, verifier, params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // this need to migrate from receipt to events

            monitor.requested(tranHash);

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {
                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Action Activity",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });
        }

    });

};

Activity.prototype.confirm = function (web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?
    this.contract.confirm(params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // this need to migrate from receipt to events

            monitor.requested(tranHash);

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {
                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Confirm verification",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });
        }

    });

};

Activity.prototype.challenge = function (web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?
    this.contract.setChallenge(params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // this need to migrate from receipt to events

            monitor.requested(tranHash);

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {

                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Challenge response",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });
        }

    });

};

Activity.prototype.delete = function (web3, params, monitor) {

    //todo: this method should know how much gas is needed rather than getting it from params?
    this.contract.kill(params, function (error, tranHash) {
        //todo: this is not handling errors like 'not a BigNumber' , do we need a try catch somewhere?

        if (error) {
            monitor.error(error);
        } else {
            // this need to migrate from receipt to events

            monitor.requested(tranHash);

            ZoneTransactionReceipt.check(tranHash, web3, function (error, receipt) {

                if (error) {
                    monitor.error(error);
                } else {
                    // log the transaction

                    ZidTransactionData.insert({
                        type: "Delete Activity",
                        date: new Date(),
                        transactionHash: receipt.transactionHash,
                        blockNumber: receipt.blockNumber,
                        from: receipt.from,
                        to: receipt.to,
                        gas: receipt.gasUsed,
                        cumulativeGasUsed: receipt.cumulativeGasUsed
                    });

                    // let the caller know

                    monitor.completed(receipt);
                }

            });
        }

    });

};

export {Activity} ;