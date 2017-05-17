/**
 * Created by pjworrall on 13/05/2017.
 */

import { ZonafideAddressBook } from './addressbook.js';

import lightwallet from 'eth-lightwallet';

import  {ZidStore , SessionPasswordOveride } from '/imports/startup/client/globals.js';


describe('addressbook', function () {

    let _zid = "0x1234567...";
    let _common = "Paul John";
    let _family = "Worrall";
    let _address = "0x09d5043d675d5ca75ee7bb51691fcc44543faade";
    let _password = "foo";
    // Charlie test user seed
    let _seed = "foil unlock shy slice speed payment coral bring guard wheat grant upgrade";

    lightwallet.keystore.deriveKeyFromPassword(_password, function (err, pwDerivedKey) {

        if (err) {
            console.log('Failed to derive Key from password..dev issue', {timeout: 'none'});
        } else {

            try {
                let Keystore = new lightwallet.keystore(
                    _seed,
                    pwDerivedKey);

                Keystore.generateNewAddress(pwDerivedKey, 1);

                // put the keystore into a global
                ZidStore.set(Keystore, Session);

            } catch(err) {
                console.log('Was not able to obtain Key, is Key correct?', {timeout: 'none'});
            }
        }
    });


    it('add a contact record', function (done) {

        // should I use try / catch?
        ZonafideAddressBook.save(_zid, _address, _common, _family );

        let _result = ZonafideAddressBook.find(_zid, _address);

        console.log("z/ contact> common: " + _result.contact.common + ", family: " + _result.contact.family );

        chai.assert(_result.contact.common === _common, "did not find the saved contact");

        done();

    });

    it('remove a contact record', function (done) {

        // should I use try / catch?

        let _record = ZonafideAddressBook.find(_zid, _address);

        ZonafideAddressBook.remove(_record);

        let _result = ZonafideAddressBook.find(_zid, _address);

        chai.assert( typeof _result === 'undefined' , "contact should not have existed after deletion");

        done();

    });

    it('sign a contact record', function (done) {

        let callback = function (error, pwDerivedKey) {

            if (!error) {

                ZonafideAddressBook.save(_zid, _address, _common, _family);

                let _result = ZonafideAddressBook.find(_zid, _address);

                let doc = JSON.stringify(_result);

                // sign the contact object and add the signature to it
                _result.signature = lightwallet.signing.signMsg(ZidStore.get(), pwDerivedKey, doc, ZidStore.get().getAddresses()[0]);

                // tmp copy the sig out
                let s1 = _result.signature;
                // remove the sig from the record
                delete _result.signature;
                // generate the sig again and add it to the contact record
                _result.signature = lightwallet.signing.signMsg(ZidStore.get(), pwDerivedKey, doc, ZidStore.get().getAddresses()[0]);

                // compare the before and after sigs
                chai.assert.deepEqual( _result.signature, s1 , "contact record signature didn't reproduce");

                done();

            } else {
                done("failed to derive key: " + error);
            }

        };

        lightwallet.keystore.deriveKeyFromPassword(_password, callback);

    })

});