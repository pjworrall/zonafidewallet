/**
 * Created by pjworrall on 25/02/2017.
 */

import  {ZidUserLocalData} from '/imports/startup/client/globals.js';

let ZonafideMonitor = (function () {

    let Monitor;
    let listeners;
    let clients = [];

    /* this function will dispatch watched events to all registered views */
    function dispatcher(error, event) {

        // general alert output for testing
        if (!error) {
            sAlert.info(': ' + JSON.stringify(event),
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Event Received'});
        } else {
            sAlert.info(': ' + JSON.stringify(error),
                {timeout: 'none', sAlertIcon: 'fa fa-info-circle', sAlertTitle: 'Unexpected error'});
        }

    }

    /* todo: test */

    function isMonitored(address) {

        let answer = listeners.some(function (element) {
            return element.address === address
        });

        console.log("isMonitored:  " + address + ",  " + answer);

    }


    function createInstance(address) {

        Monitor = {

            initialize: function (address) {

                console.log("initializing monitor: " + listener.address);

                console.log("getting zones from store... ");
                let zones = ZidUserLocalData.find(
                    {zid: address},
                    {sort: {created: -1}});

                zones.forEach(function (zone) {
                    // if zone not confirmed
                    console.log("creating watch on ... " + zone.address);

                    if (!zone.isConfirmed()) {

                        let events = zone.allEvents({fromBlock: 0, toBlock: 'latest'});
                        let listener = {
                            address: zone.address,
                            events: events
                        };
                        listeners.push(listener);
                        events.watch(dispatcher);

                        console.log("monitor added for " + listener.address);

                    }
                });
            },

            /* set a monitor on a contract for all events */
            setMonitor: function (zone, callback) {

                console.log("monitor set");

                let events = zone.allEvents({fromBlock: 0, toBlock: 'latest'});

                let listener = {
                    address: zone.address,
                    events: events
                };

                listeners.push(listener);

                events.watch(callback);

            },
            /* stop watching a monitor and remove it*/
            unsetMonitor: function (zone) {

                console.log("unset monitor");

                listeners = listeners.filter(function (element) {
                    if (element.address === zone.address) {
                        console.log("stopping watching before removing from listeners");
                        element.events.stopWatching();
                        return false;
                    } else {
                        return true;
                    }
                });
            }
            ,
            /* stop all monitoring*/
            removeMonitors: function () {

                console.log("removing monitors");

                listeners.forEach(function (element) {
                    element.events.stopWatching();
                });

                listeners = [];
            }
        };

        console.log("Monitor.initialize(): " + address);

        try {
            Monitor.initialize(address);
        } catch (error) {
            Console.log("error Monitor.initialize(address):" + error);
        }

        return Monitor;

    }


    return {

        getInstance: function (address) {

            console.log("getInstance called: " + address);

            if (!Monitor) {
                createInstance(address);
            } else {
                return Monitor;
            }

        },


    }

})();

export {ZonafideMonitor};