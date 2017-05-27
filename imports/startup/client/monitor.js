/**
 * Created by pjworrall on 25/02/2017.
 *
 * Not switch to JS 6 in this code !!!!!!!!!!!
 *
 *
 */

/*
 * Expect functions to be replaced when used
 */

function Monitor() {
    this.completed = function (contract) {
        console.log("z/ contract created, address: " + contract.address) ;
    };
    this.requested = function (contract) {
        console.log("z/ contract creation transaction hash: " + contract.transactionHash) ;
    };
    this.error = function (error) {
        console.log("z/ contract creation error: " + error) ;

    }
}

export {Monitor}

