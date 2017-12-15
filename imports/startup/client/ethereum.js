/**
 * Created by pjworrall on 09/05/2016.
 *
 * Contract version: v7
 */

let ZonafideEnvironment = function () {

    return {
        caller: function (_from) {
            var c = {};
            c.from = _from;
            c.data = this.code;
            c.gas = this.Gas;
            c.gasPrice = this.GasPrice;
            return c;
        },
        'Gas': 3000000,
        'GasPrice': 18000000010,
        'Node': 'http://zonafide.space:3090',
        'ContractVersion': '4c4db623',
        'abi': [{
            "constant": false,
            "inputs": [{"name": "description", "type": "string"}, {"name": "serviceProvider", "type": "address"}],
            "name": "action",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isActive",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "kill",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getVerifier",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "amIAnAcknowledger",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "whatIsActive",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "confirm",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getAcknowledgers",
            "outputs": [{"name": "", "type": "address[]"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "setChallenge",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getChallenge",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getOwner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getMembers",
            "outputs": [{"name": "", "type": "address[]"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "member", "type": "address"}],
            "name": "isMember",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "setAcknowledgement",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isConfirmed",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "member", "type": "address"}],
            "name": "isAcknowledger",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "members", "type": "address[]"}, {"name": "quorum", "type": "uint8"}],
            "name": "setMembers",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "amIVerifier",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isQuorum",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "acknowledger", "type": "address"}],
            "name": "Acknowledged",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "activity", "type": "address"}, {
                "indexed": false,
                "name": "owner",
                "type": "address"
            }],
            "name": "Kill",
            "type": "event"
        }],
        'code': '606060405260008060146101000a81548160ff02191690831515021790555060008060156101000a81548160ff02191690831515021790555060008060166101000a81548160ff0219169083151502179055506040805190810160405280600881526020017f696e616374697665000000000000000000000000000000000000000000000000815250600190805190602001906200009f9291906200010e565b506000600460146101000a81548160ff021916908360ff1602179055503415620000c857600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620001bd565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200015157805160ff191683800117855562000182565b8280016001018555821562000182579182015b828111156200018157825182559160200191906001019062000164565b5b50905062000191919062000195565b5090565b620001ba91905b80821115620001b65760008160009055506001016200019c565b5090565b90565b61190e80620001cd6000396000f300606060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631f5c1d981461010c57806322f3e2d41461018857806341c0e1b5146101b557806346657fe9146101ca57806349f57a041461021f57806367a57f0e1461024c5780637022b58e146102da57806370d37efc14610368578063710dabe6146103d2578063759014f0146103ff578063893d20e81461042c5780639eab525314610481578063a230c524146104eb578063a3d5e7f91461053c578063a79a3cee14610551578063aca0c0a61461057e578063b6e77c53146105cf578063c4dbc52114610635578063d81d658f14610662575b600080fd5b341561011757600080fd5b610186600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061068f565b005b341561019357600080fd5b61019b610784565b604051808215151515815260200191505060405180910390f35b34156101c057600080fd5b6101c861084e565b005b34156101d557600080fd5b6101dd61097a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561022a57600080fd5b610232610a57565b604051808215151515815260200191505060405180910390f35b341561025757600080fd5b61025f610a67565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561029f578082015181840152602081019050610284565b50505050905090810190601f1680156102cc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102e557600080fd5b6102ed610bc2565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561032d578082015181840152602081019050610312565b50505050905090810190601f16801561035a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037357600080fd5b61037b610c67565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156103be5780820151818401526020810190506103a3565b505050509050019250505060405180910390f35b34156103dd57600080fd5b6103e5610dae565b604051808215151515815260200191505060405180910390f35b341561040a57600080fd5b610412610e39565b604051808215151515815260200191505060405180910390f35b341561043757600080fd5b61043f610e4f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561048c57600080fd5b610494610f2b565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156104d75780820151818401526020810190506104bc565b505050509050019250505060405180910390f35b34156104f657600080fd5b610522600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611072565b604051808215151515815260200191505060405180910390f35b341561054757600080fd5b61054f611137565b005b341561055c57600080fd5b61056461122b565b604051808215151515815260200191505060405180910390f35b341561058957600080fd5b6105b5600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506112f5565b604051808215151515815260200191505060405180910390f35b34156105da57600080fd5b61063360048080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190803560ff169060200190919050506113ba565b005b341561064057600080fd5b61064861146e565b604051808215151515815260200191505060405180910390f35b341561066d57600080fd5b6106756114d7565b604051808215151515815260200191505060405180910390f35b60011515600060159054906101000a900460ff161515141515156106b257600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561070d57600080fd5b6001600060146101000a81548160ff021916908315150217905550816001908051906020019061073e92919061171c565b5080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061082e5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561083957600080fd5b600060149054906101000a900460ff16905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108a957600080fd5b7f121c8e38eb63db044ce3115b253a18207f3f709ef92b91329aa3f0552c9e246b3033604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a16000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610a245750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610a2f57600080fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000610a62336115d4565b905090565b610a6f61179c565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610b175750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610b2257600080fd5b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bb85780601f10610b8d57610100808354040283529160200191610bb8565b820191906000526020600020905b815481529060010190602001808311610b9b57829003601f168201915b5050505050905090565b610bca61179c565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c2657600080fd5b60011515600060149054906101000a900460ff16151514151515610c4957600080fd5b6001600060156101000a81548160ff02191690831515021790555090565b610c6f6117b0565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610d175750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610d2257600080fd5b6003805480602002602001604051908101604052809291908181526020018280548015610da457602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610d5a575b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e0b57600080fd5b600060169054906101000a900460ff1615600060166101000a81548160ff0219169083151502179055905090565b60008060169054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610ef95750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610f0457600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610f336117b0565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610fdb5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610fe657600080fd5b600280548060200260200160405190810160405280929190818152602001828054801561106857602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161101e575b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061111c5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561112757600080fd5b611130826115d4565b9050919050565b60011515600060159054906101000a900460ff1615151415151561115a57600080fd5b611163336115d4565b15151561116f57600080fd5b61117833611678565b1561118257611229565b6003805480600101828161119691906117c4565b9160005260206000209001600033909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503373ffffffffffffffffffffffffffffffffffffffff167f1e12bb9d8a6fa9c6e93e47ec1e0a086367ab31b5f2843524fb430c4a0853804e60405160405180910390a25b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806112d55750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156112e057600080fd5b600060159054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061139f5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156113aa57600080fd5b6113b382611678565b9050919050565b60011515600060159054906101000a900460ff161515141515156113dd57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561143857600080fd5b816002908051906020019061144e9291906117f0565b5080600460146101000a81548160ff021916908360ff1602179055505050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156114cf57600190506114d4565b600090505b90565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806115815750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561158c57600080fd5b600060038054905014156115a357600090506115d1565b600460149054906101000a900460ff1660ff166003805490501015156115cc57600190506115d1565b600090505b90565b600080600090505b60028054905081101561166d578273ffffffffffffffffffffffffffffffffffffffff1660028281548110151561160f57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156116605760019150611672565b80806001019150506115dc565b600091505b50919050565b600080600090505b600380549050811015611711578273ffffffffffffffffffffffffffffffffffffffff166003828154811015156116b357fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156117045760019150611716565b8080600101915050611680565b600091505b50919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061175d57805160ff191683800117855561178b565b8280016001018555821561178b579182015b8281111561178a57825182559160200191906001019061176f565b5b509050611798919061187a565b5090565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b8154818355818115116117eb578183600052602060002091820191016117ea919061187a565b5b505050565b828054828255906000526020600020908101928215611869579160200282015b828111156118685782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190611810565b5b509050611876919061189f565b5090565b61189c91905b80821115611898576000816000905550600101611880565b5090565b90565b6118df91905b808211156118db57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016118a5565b5090565b905600a165627a7a72305820bf82d3b12c31710bc3a4537d0c3f449ae7c2a245e4c033b35a4f2e554d95cda00029'
    }

}();

export {ZonafideEnvironment};