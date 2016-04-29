/**
 * Created by pjworrall on 28/04/2016.
 *
 * This is the controller behind the body view
 *
 */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import HookedWeb3Provider from 'hooked-web3-provider';
import lightwallet from 'eth-lightwallet';
import Web3API from 'web3';

import './body.html';

var Gas = 3000000;
var GasPrice = 18000000010;

var abi = [{
    "constant": true,
    "inputs": [],
    "name": "active",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "quorum",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_description", "type": "string"}, {"name": "_serviceProvider", "type": "address"}],
    "name": "action",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isActive",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"constant": false, "inputs": [], "name": "kill", "outputs": [], "type": "function"}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "members",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "whatIsActive",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "confirm",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "description",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "serviceProvider",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "acknowledgers",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "isMember",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "setAcknowledgement",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "isAcknowledger",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"constant": false, "inputs": [], "name": "revoke", "outputs": [], "type": "function"}, {
    "constant": false,
    "inputs": [{"name": "_members", "type": "address[]"}, {"name": "_quorum", "type": "uint8"}],
    "name": "setMembers",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "isQuorum",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
}, {"inputs": [], "type": "constructor"}, {
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
}];

var code = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600060146101000a81548160ff02191690830217905550604060405190810160405280600881526020017f696e61637469766500000000000000000000000000000000000000000000000081526020015060016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100d157805160ff1916838001178555610102565b82800160010185558215610102579182015b828111156101015782518260005055916020019190600101906100e3565b5b50905061012d919061010f565b80821115610129576000818150600090555060010161010f565b5090565b50506000600460146101000a81548160ff021916908302179055505b611025806101576000396000f3606060405236156100f8576000357c01000000000000000000000000000000000000000000000000000000009004806302fb0c5e146101055780631703a018146101285780631f5c1d981461014e57806322f3e2d4146101ad57806341c0e1b5146101d05780635daf08ca146101df57806367a57f0e146102215780637022b58e1461029c5780637284e416146103175780638d69e95e146103925780638da5cb5b146103cb57806399b1de9f14610404578063a230c52414610446578063a3d5e7f914610472578063aca0c0a614610481578063b6549f75146104ad578063b6e77c53146104bc578063d81d658f14610518576100f8565b6101035b610002565b565b005b6101126004805050610561565b6040518082815260200191505060405180910390f35b61013560048050506106bf565b604051808260ff16815260200191505060405180910390f35b6101ab6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091905050610bb7565b005b6101ba6004805050610ac6565b6040518082815260200191505060405180910390f35b6101dd6004805050610f91565b005b6101f56004808035906020019091905050610615565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61022e6004805050610ae2565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561028e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102a96004805050610e06565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103095780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103246004805050610574565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103845780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61039f6004805050610699565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103d8600480505061053b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61041a6004808035906020019091905050610657565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61045c6004808035906020019091905050610911565b6040518082815260200191505060405180910390f35b61047f6004805050610809565b005b61049760048080359060200190919050506109bf565b6040518082815260200191505060405180910390f35b6104ba6004805050610f1e565b005b610516600480803590602001908201803590602001919190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509090919080359060200190919050506106d2565b005b6105256004805050610a6d565b6040518082815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060149054906101000a900460ff1681565b60016000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561060d5780601f106105e25761010080835404028352916020019161060d565b820191906000526020600020905b8154815290600101906020018083116105f057829003601f168201915b505050505081565b600260005081815481101561000257906000526020600020900160005b9150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360005081815481101561000257906000526020600020900160005b9150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460149054906101000a900460ff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156107ff578160026000509080519060200190828054828255906000526020600020908101928215610799579160200282015b828111156107985782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555091602001919060010190610756565b5b5090506107e091906107a6565b808211156107dc57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016107a6565b5090565b505080600460146101000a81548160ff02191690830217905550610804565b610002565b5b5050565b61081233610911565b151561081d57610002565b610826336109bf565b156108305761090f565b60036000508054806001018281815481835581811511610882578183600052602060002091820191016108819190610863565b8082111561087d5760008181506000905550600101610863565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550507fe820ca25c395b3e6db1084825e20a78677611a2c7e0a43a68c53c6fb7ae8e3b533604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b60006000600090505b6002600050805490508110156109b0578273ffffffffffffffffffffffffffffffffffffffff16600260005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156109a257600191506109b9565b5b808060010191505061091a565b600091506109b9565b50919050565b60006000600090505b600360005080549050811015610a5e578273ffffffffffffffffffffffffffffffffffffffff16600360005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610a505760019150610a67565b5b80806001019150506109c8565b60009150610a67565b50919050565b600060006003600050805490501415610a895760009050610ac3565b600460149054906101000a900460ff1660ff16600360005080549050101515610ab95760019050610ac356610ac2565b60009050610ac3565b5b90565b6000600060149054906101000a900460ff169050610adf565b90565b60206040519081016040528060008152602001506001600060149054906101000a900460ff161415610bb35760016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ba75780601f10610b7c57610100808354040283529160200191610ba7565b820191906000526020600020905b815481529060010190602001808311610b8a57829003601f168201915b50505050509050610bb4565b5b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c1357610002565b6001600060146101000a81548160ff021916908302179055508160016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c7b57805160ff1916838001178555610cac565b82800160010185558215610cac579182015b82811115610cab578251826000505591602001919060010190610c8d565b5b509050610cd79190610cb9565b80821115610cd35760008181506000905550600101610cb9565b5090565b505080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055507f99d7758cc63ce23b119169e1f8b2dddd7f3cd69cecac309a26f03e31832011aa6001600050600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660405180806020018373ffffffffffffffffffffffffffffffffffffffff168152602001828103825284818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610df25780601f10610dc757610100808354040283529160200191610df2565b820191906000526020600020905b815481529060010190602001808311610dd557829003601f168201915b5050935050505060405180910390a15b5050565b6020604051908101604052806000815260200150600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e7657610f1b565b60016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f0f5780601f10610ee457610100808354040283529160200191610f0f565b820191906000526020600020905b815481529060010190602001808311610ef257829003601f168201915b50505050509050610f1b565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610f8e576000600060146101000a81548160ff021916908302179055505b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561102257600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b56';

var Web3 = new Web3API();
var ethClient = 'http://localhost:1166';
var Keystore;
var Zone;

Session.set('zid', "yet to be unlocked");
Session.set('zad',"none currently");
Session.set('ismember',"");

function setWeb3Provider(keystore) {

    var web3Provider = new HookedWeb3Provider({
        host: ethClient,
        transaction_signer: keystore
    });

    Web3.setProvider(web3Provider);

}

Template.body.helpers({

    zid() {
        // this would return a reactive var value
        return Session.get('zid');
    },
    zad() {
        // this would return a reactive var value
        return Session.get('zad');
    },
    members() {
        // this would return a reactive var value
        return "set some members for you";
    },
    ismember() {
        // this would return a reactive var value
        return Session.get('ismember');
    }

});

Template.body.events({
    'submit .create-zone'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // if there is no web3 session should this happen at all (aka keystore)?

        // override zid at the moment for testing, will need to get from global_keystore
        const zid ='0xd90b704c738b49ff50741bd887334e49d8f277f1';

        var zoneFactory = Web3.eth.contract(abi);

        if( typeof Keystore != 'undefined') {

            zoneFactory.new(
                {
                    from: Keystore.getAddresses()[0],
                    data: code,
                    gas: Gas,
                    gasPrice: GasPrice
                }, function (e, contract) {
                    if (typeof contract.address != 'undefined') {
                        console.log('Confirmed. address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                        Zone = contract;
                        Session.set('zad', contract.address);
                    }
                });
        }

    },
    'submit .set-member'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        //todo: should probably check address for member is valid
        const members = [target.member.value];

        // quorum will be one until we have multiple member support in the ui
        var quorum = 1;

        if(typeof Zone != 'undefined' || typeof Keystore != 'undefined' ) {
            Zone.setMembers(members, quorum,
                {
                    from: Keystore.getAddresses()[0],
                    gas: Gas,
                    gasPrice: GasPrice
                }, function (e, obj) {
                    if (e) {
                        console.log('Error setting members: ' + e);
                    } else {
                        console.log("Success setting members:" + obj);
                    }
                });
        } else {
            console.log("Zone or keystore not defined yet.")
        }

    },
    'submit .is-member'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        //todo: should probably check address for member is valid
        const member = target.ismember.value;

        if(typeof Zone != 'undefined' ) {
            Zone.isMember(member, function (e, result) {
                    if (!e) {
                        console.log('Error checking a member: ' + result);
                        if(result) {
                            Session.set('ismember',"They are a member");
                        } else {
                            Session.set('ismember',"They are not a member");
                        }
                    }
                });
        } else {
            console.log("Zone is not defined yet.")
        }

    },
    'submit .set-credential'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const seed = target.seed.value;

        //todo: need to collect this from user, maybe put in session or something safer
        var password = 'daytona';

        console.log("getting credentials with: " + password + "/" + seed);

        lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

            Keystore = new lightwallet.keystore(
                seed,
                pwDerivedKey);

            // the parameter 1 is the number of addresses in the HD wallet to create. We only need 1 currently.
            Keystore.generateNewAddress(pwDerivedKey, 1);

            setWeb3Provider(Keystore);

            Session.set('zid', Keystore.getAddresses()[0]);

        });
    }
});

