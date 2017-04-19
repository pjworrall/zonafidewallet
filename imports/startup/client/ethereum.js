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
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isActive",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "kill",
            "outputs": [],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getVerifier",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "amIAnAcknowledger",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "whatIsActive",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "confirm",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getAcknowledgers",
            "outputs": [{"name": "", "type": "address[]"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "setChallenge",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getChallenge",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getOwner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getMembers",
            "outputs": [{"name": "", "type": "address[]"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "member", "type": "address"}],
            "name": "isMember",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "setAcknowledgement",
            "outputs": [],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isConfirmed",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "member", "type": "address"}],
            "name": "isAcknowledger",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "members", "type": "address[]"}, {"name": "quorum", "type": "uint8"}],
            "name": "setMembers",
            "outputs": [],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "amIVerifier",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isQuorum",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {"inputs": [], "payable": false, "type": "constructor"}, {
            "payable": false,
            "type": "fallback"
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
        'code': '0x60606040526000600060146101000a81548160ff0219169083151502179055506000600060156101000a81548160ff0219169083151502179055506000600060166101000a81548160ff021916908315150217905550604060405190810160405280600881526020017f696e61637469766500000000000000000000000000000000000000000000000081525060019080519060200190620000a392919062000112565b506000600460146101000a81548160ff021916908360ff1602179055503415620000c957fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b620001c1565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200015557805160ff191683800117855562000186565b8280016001018555821562000186579182015b828111156200018557825182559160200191906001019062000168565b5b50905062000195919062000199565b5090565b620001be91905b80821115620001ba576000816000905550600101620001a0565b5090565b90565b61197080620001d16000396000f30060606040523615610105576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631f5c1d981461011b57806322f3e2d41461019457806341c0e1b5146101be57806346657fe9146101d057806349f57a041461022257806367a57f0e1461024c5780637022b58e146102e557806370d37efc1461037e578063710dabe6146103f3578063759014f01461041d578063893d20e8146104475780639eab525314610499578063a230c5241461050e578063a3d5e7f91461055c578063a79a3cee1461056e578063aca0c0a614610598578063b6e77c53146105e6578063c4dbc52114610649578063d81d658f14610673575b341561010d57fe5b6101195b60006000fd5b565b005b341561012357fe5b610192600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061069d565b005b341561019c57fe5b6101a4610796565b604051808215151515815260200191505060405180910390f35b34156101c657fe5b6101ce610864565b005b34156101d857fe5b6101e0610996565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561022a57fe5b610232610a77565b604051808215151515815260200191505060405180910390f35b341561025457fe5b61025c610a88565b60405180806020018281038252838181518152602001915080519060200190808383600083146102ab575b8051825260208311156102ab57602082019150602081019050602083039250610287565b505050905090810190601f1680156102d75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102ed57fe5b6102f5610be7565b6040518080602001828103825283818151815260200191508051906020019080838360008314610344575b80518252602083111561034457602082019150602081019050602083039250610320565b505050905090810190601f1680156103705780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561038657fe5b61038e610c8f565b60405180806020018281038252838181518152602001915080519060200190602002808383600083146103e0575b8051825260208311156103e0576020820191506020810190506020830392506103bc565b5050509050019250505060405180910390f35b34156103fb57fe5b610403610dda565b604051808215151515815260200191505060405180910390f35b341561042557fe5b61042d610e69565b604051808215151515815260200191505060405180910390f35b341561044f57fe5b610457610e81565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156104a157fe5b6104a9610f62565b60405180806020018281038252838181518152602001915080519060200190602002808383600083146104fb575b8051825260208311156104fb576020820191506020810190506020830392506104d7565b5050509050019250505060405180910390f35b341561051657fe5b610542600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506110ad565b604051808215151515815260200191505060405180910390f35b341561056457fe5b61056c611176565b005b341561057657fe5b61057e61126e565b604051808215151515815260200191505060405180910390f35b34156105a057fe5b6105cc600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061133c565b604051808215151515815260200191505060405180910390f35b34156105ee57fe5b61064760048080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190803560ff16906020019091905050611405565b005b341561065157fe5b6106596114bd565b604051808215151515815260200191505060405180910390f35b341561067b57fe5b61068361152b565b604051808215151515815260200191505060405180910390f35b60011515600060159054906101000a900460ff16151514156106bf5760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561071c5760006000fd5b6001600060146101000a81548160ff021916908315150217905550816001908051906020019061074d92919061177e565b5080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b5b5050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806108415750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561084d5760006000fd5b600060149054906101000a900460ff1690505b5b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108c15760006000fd5b7f121c8e38eb63db044ce3115b253a18207f3f709ef92b91329aa3f0552c9e246b3033604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610a415750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610a4d5760006000fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b5b90565b6000610a8233611630565b90505b90565b610a906117fe565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610b395750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610b455760006000fd5b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bdb5780601f10610bb057610100808354040283529160200191610bdb565b820191906000526020600020905b815481529060010190602001808311610bbe57829003601f168201915b505050505090505b5b90565b610bef6117fe565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c4c5760006000fd5b60011515600060149054906101000a900460ff161515141515610c6f5760006000fd5b6001600060156101000a81548160ff0219169083151502179055505b5b90565b610c97611812565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610d405750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610d4c5760006000fd5b6003805480602002602001604051908101604052809291908181526020018280548015610dce57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610d84575b505050505090505b5b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e395760006000fd5b600060169054906101000a900460ff1615600060166101000a81548160ff021916908315150217905590505b5b90565b6000600060169054906101000a900460ff1690505b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610f2c5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610f385760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b5b90565b610f6a611812565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806110135750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561101f5760006000fd5b60028054806020026020016040519081016040528092919081815260200182805480156110a157602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611057575b505050505090505b5b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806111585750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156111645760006000fd5b61116d82611630565b90505b5b919050565b60011515600060159054906101000a900460ff16151514156111985760006000fd5b6111a133611630565b15156111ad5760006000fd5b6111b6336116d7565b156111c05761126b565b600380548060010182816111d49190611826565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503373ffffffffffffffffffffffffffffffffffffffff167f1e12bb9d8a6fa9c6e93e47ec1e0a086367ab31b5f2843524fb430c4a0853804e60405180905060405180910390a25b5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806113195750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156113255760006000fd5b600060159054906101000a900460ff1690505b5b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806113e75750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156113f35760006000fd5b6113fc826116d7565b90505b5b919050565b60011515600060159054906101000a900460ff16151514156114275760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114845760006000fd5b816002908051906020019061149a929190611852565b5080600460146101000a81548160ff021916908360ff1602179055505b5b5b5050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561151e5760019050611528565b60009050611528565b5b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806115d65750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156115e25760006000fd5b600060038054905014156115f9576000905061162c565b600460149054906101000a900460ff1660ff16600380549050101515611622576001905061162c565b6000905061162c565b5b5b90565b60006000600090505b6002805490508110156116cc578273ffffffffffffffffffffffffffffffffffffffff1660028281548110151561166c57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156116be57600191506116d1565b5b8080600101915050611639565b600091505b50919050565b60006000600090505b600380549050811015611773578273ffffffffffffffffffffffffffffffffffffffff1660038281548110151561171357fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156117655760019150611778565b5b80806001019150506116e0565b600091505b50919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106117bf57805160ff19168380011785556117ed565b828001600101855582156117ed579182015b828111156117ec5782518255916020019190600101906117d1565b5b5090506117fa91906118dc565b5090565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b81548183558181151161184d5781836000526020600020918201910161184c91906118dc565b5b505050565b8280548282559060005260206000209081019282156118cb579160200282015b828111156118ca5782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190611872565b5b5090506118d89190611901565b5090565b6118fe91905b808211156118fa5760008160009055506001016118e2565b5090565b90565b61194191905b8082111561193d57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101611907565b5090565b905600a165627a7a7230582006bfe5e7a300b1cad6207e9cfec09a882a49e02fac3cc100a88feae21cd3521d0029'
    }

}();

export {ZonafideEnvironment};