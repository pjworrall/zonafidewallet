/**
 * Created by pjworrall on 25/02/2017.
 *
 * Not switch to JS 6 in this code !!!!!!!!!!!
 *
 *
 */

// import  {ZidUserLocalData} from '/imports/startup/client/globals.js';

/*
 *
 * let events = zone.allEvents({fromBlock: 0, toBlock: 'latest'});
 * events.watch(dispatcher);
 *
 */


export class ZonafideMonitor {

    watch (zone) {
        let events = zone.allEvents({fromBlock: 0, toBlock: 'latest'});
        events.watch( () => { console.log("ooh big poo!!!!!!!!") });
    }

}
