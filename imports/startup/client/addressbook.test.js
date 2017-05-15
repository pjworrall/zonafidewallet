/**
 * Created by pjworrall on 13/05/2017.
 */

import { ZonafideAddressBook } from './addressbook.js';


describe('addressbook', function () {

    let _common = "Paul John";
    let _family = "Worrall";
    let _address = "0x09d5043d675d5ca75ee7bb51691fcc44543faade";

    let _contact = { common: _common, family: _family, address: _address};

    it('save a contact', function (done) {

        // should I use try / catch?
        ZonafideAddressBook.save(_contact);

        let _result = ZonafideAddressBook.find(_address);

        console.log("z/ contact> common: " + _result.common + ", family: " + _family );

        chai.assert(_result.common === _common, "did not find the saved contact");

        done();

    });

    it('remove a contact', function (done) {

        // should I use try / catch?

        let _contact = ZonafideAddressBook.find(_address);

        ZonafideAddressBook.remove(_contact);

        let _result = ZonafideAddressBook.find(_address);

        chai.assert( typeof _result === 'undefined' , "found a deleted contact");

        done();

    });

});