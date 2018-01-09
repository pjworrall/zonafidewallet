/**
 * Created by pjworrall on 09/05/2016.
 *
 * Contract version: cecb50c
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
        'Gas': 0x1c33c9,
        'GasPrice': 0x756A528800,
        'Node': 'http://zonafide.space:3090',
        'ContractVersion': 'cecb50c',
        'abi': [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "name": "serviceProvider",
                        "type": "address"
                    }
                ],
                "name": "action",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "isActive",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "kill",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getVerifier",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "amIAnAcknowledger",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "whatIsActive",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "confirm",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getAcknowledgers",
                "outputs": [
                    {
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "setChallenge",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getChallenge",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getMembers",
                "outputs": [
                    {
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "member",
                        "type": "address"
                    }
                ],
                "name": "isMember",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "setAcknowledgement",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "isConfirmed",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "member",
                        "type": "address"
                    }
                ],
                "name": "isAcknowledger",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "members",
                        "type": "address[]"
                    },
                    {
                        "name": "quorum",
                        "type": "uint8"
                    }
                ],
                "name": "setMembers",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "amIVerifier",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "isQuorum",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "acknowledger",
                        "type": "address"
                    }
                ],
                "name": "Acknowledged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "activity",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "Kill",
                "type": "event"
            }
        ],
        'code': '606060405260008060146101000a81548160ff02191690831515021790555060008060156101000a81548160ff02191690831515021790555060008060166101000a81548160ff0219169083151502179055506040805190810160405280600881526020017f696e616374697665000000000000000000000000000000000000000000000000815250600190805190602001906200009f9291906200010e565b506000600460146101000a81548160ff021916908360ff1602179055503415620000c857600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620001bd565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200015157805160ff191683800117855562000182565b8280016001018555821562000182579182015b828111156200018157825182559160200191906001019062000164565b5b50905062000191919062000195565b5090565b620001ba91905b80821115620001b65760008160009055506001016200019c565b5090565b90565b61190c80620001cd6000396000f300606060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631f5c1d981461010c57806322f3e2d41461018857806341c0e1b5146101b557806346657fe9146101ca57806349f57a041461021f57806367a57f0e1461024c5780637022b58e146102da57806370d37efc14610368578063710dabe6146103d2578063759014f0146103ff578063893d20e81461042c5780639eab525314610481578063a230c524146104eb578063a3d5e7f91461053c578063a79a3cee14610551578063aca0c0a61461057e578063b6e77c53146105cf578063c4dbc52114610635578063d81d658f14610662575b600080fd5b341561011757600080fd5b610186600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061068f565b005b341561019357600080fd5b61019b610784565b604051808215151515815260200191505060405180910390f35b34156101c057600080fd5b6101c861084e565b005b34156101d557600080fd5b6101dd61097a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561022a57600080fd5b610232610a57565b604051808215151515815260200191505060405180910390f35b341561025757600080fd5b61025f610a67565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561029f578082015181840152602081019050610284565b50505050905090810190601f1680156102cc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102e557600080fd5b6102ed610bc2565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561032d578082015181840152602081019050610312565b50505050905090810190601f16801561035a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037357600080fd5b61037b610c66565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156103be5780820151818401526020810190506103a3565b505050509050019250505060405180910390f35b34156103dd57600080fd5b6103e5610dad565b604051808215151515815260200191505060405180910390f35b341561040a57600080fd5b610412610e38565b604051808215151515815260200191505060405180910390f35b341561043757600080fd5b61043f610e4e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561048c57600080fd5b610494610f2a565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156104d75780820151818401526020810190506104bc565b505050509050019250505060405180910390f35b34156104f657600080fd5b610522600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611071565b604051808215151515815260200191505060405180910390f35b341561054757600080fd5b61054f611136565b005b341561055c57600080fd5b610564611229565b604051808215151515815260200191505060405180910390f35b341561058957600080fd5b6105b5600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506112f3565b604051808215151515815260200191505060405180910390f35b34156105da57600080fd5b61063360048080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190803560ff169060200190919050506113b8565b005b341561064057600080fd5b61064861146c565b604051808215151515815260200191505060405180910390f35b341561066d57600080fd5b6106756114d5565b604051808215151515815260200191505060405180910390f35b60011515600060159054906101000a900460ff161515141515156106b257600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561070d57600080fd5b6001600060146101000a81548160ff021916908315150217905550816001908051906020019061073e92919061171a565b5080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061082e5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561083957600080fd5b600060149054906101000a900460ff16905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108a957600080fd5b7f121c8e38eb63db044ce3115b253a18207f3f709ef92b91329aa3f0552c9e246b3033604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a16000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610a245750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610a2f57600080fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000610a62336115d2565b905090565b610a6f61179a565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610b175750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610b2257600080fd5b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bb85780601f10610b8d57610100808354040283529160200191610bb8565b820191906000526020600020905b815481529060010190602001808311610b9b57829003601f168201915b5050505050905090565b610bca61179a565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c2657600080fd5b60011515600060149054906101000a900460ff161515141515610c4857600080fd5b6001600060156101000a81548160ff02191690831515021790555090565b610c6e6117ae565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610d165750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610d2157600080fd5b6003805480602002602001604051908101604052809291908181526020018280548015610da357602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610d59575b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e0a57600080fd5b600060169054906101000a900460ff1615600060166101000a81548160ff0219169083151502179055905090565b60008060169054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610ef85750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610f0357600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610f326117ae565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610fda5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610fe557600080fd5b600280548060200260200160405190810160405280929190818152602001828054801561106757602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161101d575b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061111b5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561112657600080fd5b61112f826115d2565b9050919050565b60011515600060159054906101000a900460ff1615151415151561115957600080fd5b611162336115d2565b151561116d57600080fd5b61117633611676565b1561118057611227565b6003805480600101828161119491906117c2565b9160005260206000209001600033909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503373ffffffffffffffffffffffffffffffffffffffff167f1e12bb9d8a6fa9c6e93e47ec1e0a086367ab31b5f2843524fb430c4a0853804e60405160405180910390a25b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806112d35750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156112de57600080fd5b600060159054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061139d5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156113a857600080fd5b6113b182611676565b9050919050565b60011515600060159054906101000a900460ff161515141515156113db57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561143657600080fd5b816002908051906020019061144c9291906117ee565b5080600460146101000a81548160ff021916908360ff1602179055505050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156114cd57600190506114d2565b600090505b90565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061157f5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561158a57600080fd5b600060038054905014156115a157600090506115cf565b600460149054906101000a900460ff1660ff166003805490501015156115ca57600190506115cf565b600090505b90565b600080600090505b60028054905081101561166b578273ffffffffffffffffffffffffffffffffffffffff1660028281548110151561160d57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561165e5760019150611670565b80806001019150506115da565b600091505b50919050565b600080600090505b60038054905081101561170f578273ffffffffffffffffffffffffffffffffffffffff166003828154811015156116b157fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156117025760019150611714565b808060010191505061167e565b600091505b50919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061175b57805160ff1916838001178555611789565b82800160010185558215611789579182015b8281111561178857825182559160200191906001019061176d565b5b5090506117969190611878565b5090565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b8154818355818115116117e9578183600052602060002091820191016117e89190611878565b5b505050565b828054828255906000526020600020908101928215611867579160200282015b828111156118665782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509160200191906001019061180e565b5b509050611874919061189d565b5090565b61189a91905b8082111561189657600081600090555060010161187e565b5090565b90565b6118dd91905b808211156118d957600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016118a3565b5090565b905600a165627a7a72305820ff97cd3614c603baea264a24d1fbe1b058aa947fbe99c00a8b0fb792599b543c0029'
    }

}();

export {ZonafideEnvironment};