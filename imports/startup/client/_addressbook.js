/**
 * Created by pjworrall on 13/05/2017.
 */

import  {ZidAddressData} from './globals.js';


let ZonafideAddressBook = (function () {

    return {

        save: function (zid, address, common, family) {
            ZidAddressData.update({zid: zid, address: address},
                {$set: {zid: zid, address: address, contact: {common: common, family: family}}},
                {upsert: true}
            );
        },

        find: function (zid, address) {
            return ZidAddressData.findOne({zid: zid, address: address});
        },

        remove: function (record) {
            return ZidAddressData.remove(record);
        }
    }

})();


export {ZonafideAddressBook};