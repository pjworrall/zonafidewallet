/**
 * Created by pjworrall on 04/04/2017.
 */

import  {ZonafideEnvironment} from '/imports/startup/client/ethereum.js';

function Activity(web3, address) {
    this.web3 = web3;
    this.address = address;
    this.activity = web3.eth.contract(ZonafideEnvironment.abi).at(address);

    this.getAddress = function () {
        return this.activity.address;
    };

    this.getAcknowledgers = function (sender) {
        return this.activity.getAcknowledgers({
            from: sender
        });
    };

    this.isActive = function (sender) {
        return this.activity.isActive({
            from: sender
        });
    };

    this.getEvents = function () {
        let events = this.activity.allEvents({fromBlock: 0, toBlock: 'latest'});

        let promise = new Promise(function (resolve, reject) {

            events.get((error, result) => {
                if (error) {
                    reject(Error(error));
                } else {
                    resolve(result);
                }
            });

        });

        return promise;

    };

    // todo: no unit test
    this.watchAcknowledgment = function() {
        let event = this.activity.Acknowledged(function(error, result) {
            if (!error) {
                console.log("z/members ack event received: " + result);
            } else {
                console.log("z/members ack event error: " + error);
            }

        });
    }


}

export {Activity} ;