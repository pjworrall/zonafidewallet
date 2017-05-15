/**
 * Created by pjworrall on 13/05/2017.
 */

import  {ZidAddressData} from './globals.js';


let ZonafideAddressBook = (function () {

    return {

        save: function (contact) {
            ZidAddressData.update({address: contact.address},
                {$set: contact},
                {upsert: true}
            );
        },

        find: function (address) {
            return ZidAddressData.findOne({address: address});
        },

        remove: function (contact) {
            return ZidAddressData.remove(contact);
        }

}

})();


export { ZonafideAddressBook };