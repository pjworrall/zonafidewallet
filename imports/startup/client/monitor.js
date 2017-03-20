/**
 * Created by pjworrall on 25/02/2017.
 *
 * Not switch to JS 6 in this code !!!!!!!!!!!
 *
 *
 */

/*
 *
 * Skeleton of a monitor that will watch for contract Events
 *
 * Should replace receipt polling and form the hub of Activity
 * event watching and dispatch across the App.
 *
 * Example use:
 *     let watch = ZonafideMonitor.getInstance();
 *     watch.monitor(Activity_or_Zone);
 *
 */


let ZonafideMonitor = (function ZonafideMonitor() {

    let _monitor;

    function Monitor() {

        let _events;

        return {

            test: "test",
            startWatch: function (zone, callback) {git stgit stat

                console.log("z/monitor startWatch");
                _events = zone.allEvents({fromBlock: 0, toBlock: 'latest'});
                _events.watch(function (error,result) {
                    if(!error) {
                        console.log("z/monitor event caught: " + result);
                        callback(result);
                    }

                });
            },

            stopWatch: function (zone, callback) {
                console.log("z/monitor stopWatch");
                _events.stopWatching();
                callback(false,'stopped');
            }
        }
    }

    return {
        getInstance: function () {

            if (_monitor) {
                return _monitor;
            } else {
                _monitor = new Monitor();
                return _monitor ;
            }
        }
    }

}());





export {ZonafideMonitor};
