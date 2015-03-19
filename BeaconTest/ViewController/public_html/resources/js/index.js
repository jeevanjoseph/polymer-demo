var app = (function () {
    // Application object.
    var app = {
    };

    var regions = [{uuid : '2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6'}];

    // Dictionary of beacons.
    var beacons = {
    };

    var logToDom = function (message) {
        var e = document.createElement('label');
        e.innerText = message;

        var br = document.createElement('br');
        var br2 = document.createElement('br');
        document.body.appendChild(e);
        document.body.appendChild(br);
        document.body.appendChild(br2);

        window.scrollTo(0, window.document.height);
    };

    // Timer that displays list of beacons.
    var updateTimer = null;

    app.initialize = function () {
        document.addEventListener('deviceready', onDeviceReady, false);
    };

    function onDeviceReady() {
        // Specify a shortcut for the location manager holding the iBeacon functions.
        window.locationManager = cordova.plugins.locationManager;

        // Start tracking beacons!
        startScan();

        // Display refresh timer.
        //updateTimer = setInterval(displayBeaconList, 3000);
    }

    function startScan() {
        // The delegate object holds the iBeacon callback functions
        // specified below.
        var delegate = new locationManager.Delegate();

        // Called continuously when ranging beacons.
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
           
          setbData('#bdata_uuid', pluginResult.beacons); 
           /*
            for (var i in pluginResult.beacons) {
                // Insert beacon into table of found beacons.
                var beacon = pluginResult.beacons[i];
                beacon.timeStamp = Date.now();
                var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
                
                //logToDom('[>>>>] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult.beacons[i]));
                setLog('Beacon is in range! (' + beacon.proximity + ')');
                //setbData('#bdata', JSON.stringify(pluginResult));
                setbData('#bdata_uuid', 'UUID: ' + beacon.uuid);
                setbData('#bdata_min_maj', 'MINOR: ' + beacon.minor + ' MAJOR: ' + beacon.major);
                setbData('#bdata_rssi_acc', 'RSSI: ' + beacon.rssi + ' ACCURACY: ' + beacon.accuracy);
                found = true;

                if (found) {
                    $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/connected.png");
                }
                else {
                    console.log('Beacon not in range');
                    setLog('Beacon not in range...');
                    setbData('#bdata', "");
                    setbData('#bdata_uuid', "");
                    setbData('#bdata_min_maj', "");
                    setbData('#bdata_rssi_acc', "");
                    $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/not-connected.png");
                }

            }
            */
        };

        // Called when starting to monitor a region.
        // (Not used in this example, included as a reference.)
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            //console.log('didStartMonitoringForRegion:', pluginResult);
            //logToDom('[****] didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        // Called when monitoring and the state of a region changes.
        // state can be: UnKnown, Inside or Outside
        delegate.didDetermineStateForRegion = function (pluginResult) {
            //logToDom('[****] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
        };

        // Set the delegate object to use.
        locationManager.setDelegate(delegate);

        // Request permission from user to access location info.
        // This is needed on iOS 8.
        locationManager.requestAlwaysAuthorization();

        // Start monitoring and ranging beacons.
        for (var i in regions) {
            var beaconRegion = new locationManager.BeaconRegion(i + 1, regions[i].uuid);

            // Start ranging.
            locationManager.startRangingBeaconsInRegion(beaconRegion).fail(console.error).done();

            // Start monitoring.
            // (Not used in this example, included as a reference.)
            locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
        }
    }

    return app;
})();

app.initialize();

var setbData = function (compid, beacons) {
    var tabl = '<table>';
    for (var x in beacons){
        tabl = table + '<tr>'+beacons[x].uuid+'<\/tr>';
    }
    tabl += "<\/table>";
    $(compid).html(tabl);
};

var setLog = function (message) {
    $('#outmsg').html(message);
};