/**
 * Created by pjworrall on 25/02/2017.
 */

// todo: need to figure out how to mock a contract/Zone/Activity

import {ZonafideMonitor} from './monitor.js';


describe('monitor', function () {

    it('should return a function for watch method', function (done) {

        let _monitor = ZonafideMonitor.getInstance();

       chai.assert(typeof _monitor.startWatch === 'function', "typeof did not report monitor was a function");

       done();

    });

    it('should report test attribute value as test', function (done) {

        let _monitor = ZonafideMonitor.getInstance();

        chai.assert.equal(_monitor.test, "test", "was not the value [test]");

        done();

    });

});
