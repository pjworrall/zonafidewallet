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
        'Node': 'http://localhost:1166',
        'ContractVersion': '5f8998f',
        'abi': [{
            "constant": false,
            "inputs": [{"name": "_description", "type": "string"}, {"name": "_serviceProvider", "type": "address"}],
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
            "inputs": [{"name": "_member", "type": "address"}],
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
            "inputs": [{"name": "_member", "type": "address"}],
            "name": "isAcknowledger",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "revoke",
            "outputs": [{"name": "", "type": "int256"}],
            "payable": false,
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_members", "type": "address[]"}, {"name": "_quorum", "type": "uint8"}],
            "name": "setMembers",
            "outputs": [],
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
            "inputs": [{"indexed": false, "name": "acknowledger", "type": "address"}],
            "name": "Acknowledge",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "description", "type": "string"}, {
                "indexed": false,
                "name": "serviceProvider",
                "type": "address"
            }],
            "name": "Action",
            "type": "event"
        }],
        'code': '606060405234610000575b60008054600160a060020a03191633600160a060020a03161760a060020a60ff02191681556040805180820190915260088082527f696e616374697665000000000000000000000000000000000000000000000000602092830190815260018054948190528151601060ff19909116178155937fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6600261010083881615026000190190921691909104601f0193909304830192906100f0565b828001600101855582156100f0579182015b828111156100f05782518255916020019190600101906100d5565b5b506101119291505b8082111561010d57600081556001016100f9565b5090565b50506000805460a860020a60ff02191690556004805460a060020a60ff02191690555b5b610b61806101446000396000f3006060604052361561009e5763ffffffff60e060020a6000350416631f5c1d9881146100b057806322f3e2d41461011057806341c0e1b51461013157806367a57f0e146101405780637022b58e146101cd578063a230c5241461025a578063a3d5e7f914610287578063a79a3cee14610296578063aca0c0a6146102b7578063b6549f75146102e4578063b6e77c5314610303578063d81d658f1461035a575b34610000576100ae5b610000565b565b005b34610000576100ae600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050509235600160a060020a0316925061037b915050565b005b346100005761011d610546565b604080519115158252519081900360200190f35b34610000576100ae610590565b005b346100005761014d6105b8565b604080516020808252835181830152835191928392908301918501908083838215610193575b80518252602083111561019357601f199092019160209182019101610173565b505050905090810190601f1680156101bf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761014d61068d565b604080516020808252835181830152835191928392908301918501908083838215610193575b80518252602083111561019357601f199092019160209182019101610173565b505050905090810190601f1680156101bf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761011d600160a060020a03600435166106fc565b604080519115158252519081900360200190f35b34610000576100ae610745565b005b346100005761011d610818565b604080519115158252519081900360200190f35b346100005761011d600160a060020a0360043516610862565b604080519115158252519081900360200190f35b34610000576102f16108ab565b60408051918252519081900360200190f35b34610000576100ae6004808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437509496505050923560ff1692506108fd915050565b005b346100005761011d6109e1565b604080519115158252519081900360200190f35b60005433600160a060020a0390811691161461039657610000565b6000805460a060020a60ff02191660a060020a17815582516001805492819052916020601f60026000198487161561010002019093169290920482018190047fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf69081019392909187019083901061041857805160ff1916838001178555610445565b82800160010185558215610445579182015b8281111561044557825182559160200191906001019061042a565b5b506104669291505b80821115610462576000815560010161044e565b5090565b505060048054600160a060020a031916600160a060020a038381169190911791829055604080519290911660208301819052818352600180546002610100828416150260001901909116049284018390527f99d7758cc63ce23b119169e1f8b2dddd7f3cd69cecac309a26f03e31832011aa93909281906060820190859080156105315780601f1061050657610100808354040283529160200191610531565b820191906000526020600020905b81548152906001019060200180831161051457829003601f168201915b5050935050505060405180910390a15b5b5050565b6000805433600160a060020a0390811691161480610572575060045433600160a060020a039081169116145b151561057d57610000565b5060005460a060020a900460ff165b5b90565b60005433600160a060020a03908116911614156100ac57600054600160a060020a0316ff5b5b565b604080516020810190915260008082525433600160a060020a03908116911614806105f1575060045433600160a060020a039081169116145b15156105fc57610000565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156106815780601f1061065657610100808354040283529160200191610681565b820191906000526020600020905b81548152906001019060200180831161066457829003601f168201915b505050505090505b5b90565b60408051602081019091526000815260045433600160a060020a039081169116146106b757610000565b60005460a060020a900460ff1615156001146106d257610000565b6000805475ff000000000000000000000000000000000000000000191660a860020a1790555b5b90565b6000805433600160a060020a0390811691161480610728575060045433600160a060020a039081169116145b151561073357610000565b61073c82610a55565b90505b5b919050565b61074e33610a55565b151561075957610000565b61076233610ac5565b1561076c576100ac565b600380548060010182818154818355818115116107ae576000838152602090206107ae9181019083015b80821115610462576000815560010161044e565b5090565b5b505050916000526020600020900160005b8154600160a060020a033381166101009390930a8381029102199091161790915560408051918252517fe820ca25c395b3e6db1084825e20a78677611a2c7e0a43a68c53c6fb7ae8e3b592509081900360200190a15b565b6000805433600160a060020a0390811691161480610844575060045433600160a060020a039081169116145b151561084f57610000565b5060005460a860020a900460ff165b5b90565b6000805433600160a060020a039081169116148061088e575060045433600160a060020a039081169116145b151561089957610000565b61073c82610ac5565b90505b5b919050565b6000805433600160a060020a039081169116146108c757610000565b60005460a860020a900460ff1615156108ef576000805460a060020a60ff021916905561058c565b5060001961058c565b5b5b90565b60005433600160a060020a0390811691161461091857610000565b815160028054828255600082905290917f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace91820191602086018215610993579160200282015b828111156109935782518254600160a060020a031916600160a060020a0390911617825560209092019160019091019061095e565b5b506109be9291505b80821115610462578054600160a060020a031916815560010161099c565b5090565b50506004805460a060020a60ff02191660a060020a60ff8416021790555b5b5050565b6000805433600160a060020a0390811691161480610a0d575060045433600160a060020a039081169116145b1515610a1857610000565b6003541515610a295750600061058c565b60045460035460a060020a90910460ff169010610a485750600161058c565b50600061058c565b5b5b90565b6000805b600254811015610aba5782600160a060020a0316600282815481101561000057906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a03161415610ab15760019150610abf565b5b600101610a59565b600091505b50919050565b6000805b600354811015610aba5782600160a060020a0316600382815481101561000057906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a03161415610b215760019150610abf565b5b600101610ac9565b600091505b509190505600a165627a7a723058209b2a6f45df20eea773208838678ab01127a1d57763d9a5787d98d3332298a7820029'
    }

}();

export {ZonafideEnvironment};