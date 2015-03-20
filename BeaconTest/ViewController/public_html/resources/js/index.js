var app = (function () {
    // Application object.
    var app = {
    };

    var regions = [{id : 'Jeevan Office', uuid : '2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6', major : 1, minor : 1, notifyEntryStateOnDisplay : true}];

    // array of beacons.
    var beacons = {
    };
    // array of beacons.
    var zoneMap = {
    };

    app.initialize = function () {
        document.addEventListener('deviceready', onDeviceReady, false);
    };

    function onDeviceReady() {
        // Specify a shortcut for the location manager holding the iBeacon functions.
        window.locationManager = cordova.plugins.locationManager;
        
        setupZones(regions);
        
        // Start tracking beacons!
        startScan();

    }
    
    function setupZones(regionArray){
        for (var i in regionArray) {
         var key = regionArray[i].uuid+ regionArray[i].major+ regionArray[i].minor;
         zoneMap[key]=regionArray[i];
        
        }
    }
    

    function startScan() {
        // The delegate object holds the iBeacon callback functions
        // specified below.
        var delegate = new locationManager.Delegate();

        // Called continuously when ranging beacons.
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
            setbData('#bdata_uuid', pluginResult.beacons);
            for (var i in pluginResult.beacons) {
                if (pluginResult.beacons.size > 0) {
                    $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/connected.png");
                }
                else {
                    $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/not-connected.png");
                }

            }

        };

        // Called when starting to monitor a region.
        // (Not used in this example, included as a reference.)
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            //console.log('didStartMonitoringForRegion:', pluginResult);
            //logToDom('[****] didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
            setbData('#bdata_uuid', pluginResult.beacons);

        };

        // Called when monitoring and the state of a region changes.
        // state can be: UnKnown, Inside or Outside
        delegate.didDetermineStateForRegion = function (pluginResult) {
            //logToDom('[****] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            
        };

        delegate.didExitRegion = function (pluginResult) {
            // logToDom('[DOM] didExitRegion: ' + JSON.stringify(pluginResult));
            // createLocalNotification("Exited " + JSON.stringify(pluginResult));
            var beacon = pluginResult.region;
            beacon.timeStamp = Date.now();
            var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
            beacons[key] = null;
            notify(beacon,"Exiting  ");

        };

        delegate.didEnterRegion = function (pluginResult) {
            // logToDom('[DOM] didEnterRegion: ' + JSON.stringify(pluginResult));
            // createLocalNotification("Entered " + JSON.stringify(pluginResult));
            var beacon = pluginResult.region;
            beacon.timeStamp = Date.now();
            var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
            beacons[key] = beacon;
            //logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult.beacons[i]));
            notify(beacon,"Entering ");
        };

        // Set the delegate object to use.
        locationManager.setDelegate(delegate);

        // Request permission from user to access location info.
        // This is needed on iOS 8.
        locationManager.requestAlwaysAuthorization();

        // Start monitoring and ranging beacons.
        for (var i in regions) {
            var beaconRegion = new locationManager.BeaconRegion(regions[i].id, regions[i].uuid, regions[i].major, regions[i].minor, regions[i].notifyEntryStateOnDisplay);

            // Start ranging.
            locationManager.startRangingBeaconsInRegion(beaconRegion).fail(console.error).done();

            // Start monitoring.
            // (Not used in this example, included as a reference.)
            locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
        }
    }
    
    function notify(beacon,msg){
        var key = beacon.uuid+beacon.major+beacon.minor;
        var zone  = zoneMap[key];
        adf.mf.api.localnotification.add( {"title" : "Title", // Notification title (Android ONLY)
                                           "alert" : msg+" "+zone.id, // Notification alert text
                                           "sound" : "SYSTEM_DEFAULT", // If set, the default system sound will be played
                                           "vibration" : "SYSTEM_DEFAULT"
                                          },
                                          function (request, response) {console.log("notofication fired") },
                                          function (request, response) {console.log("notification failed")});
    
    };

    return app;
})();

app.initialize();

var setbData = function (compid, beacons) {
    var tabl = '<table>';
    for (var x in beacons) {
        tabl += "<tr>" + "<td>" + beacons[x].uuid + "<\/td>" + "<td>" + beacons[x].minor + "<\/td>" + "<td>" + beacons[x].major + "<\/td>" + "<td>" + beacons[x].rssi + "<\/td>" + "<td>" + beacons[x].accuracy + "<\/td>" + "<td>" + beacons[x].proximity + "<\/td>" + "<\/tr>";

    }
    tabl += "<\/table>";
    $(compid).html(tabl);

    var tabl2 = '<table>';
    for (var x in beacons) {
        tabl2 += "<tr>" + beacons[x].proximity + "<\/tr>";
    }
    tabl2 += "<\/table>";

    $('#outmsg').html(tabl2);

};