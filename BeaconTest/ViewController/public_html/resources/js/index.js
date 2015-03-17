var app = (function () {
    // Application object.
    var app = {
    };

    // Specify your beacon 128bit UUIDs here.
    var regions = [// Estimote Beacon factory UUID.
{uuid : 'EB9AB493-32C2-4E5C-BF67-76E86E338BB9'},// Sample UUIDs for beacons in our lab.
{uuid : '8F0C1DDC-11E5-4A07-8910-425941B072F9'},{uuid : 'A547414E-C4D6-4778-BBEB-57BA3BD679E2'}];

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
        alert("ready to start scan")
        startScan();

        // Display refresh timer.
        updateTimer = setInterval(displayBeaconList, 500);
    }

    function startScan() {
        // The delegate object holds the iBeacon callback functions
        // specified below.
        var delegate = new locationManager.Delegate();

        // Called continuously when ranging beacons.
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
            for (var i in pluginResult.beacons) {
                // Insert beacon into table of found beacons.
                var beacon = pluginResult.beacons[i];
                beacon.timeStamp = Date.now();
                var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
                beacons[key] = beacon;
                //logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult.beacons[i]));
            }
        };

        // Called when starting to monitor a region.
        // (Not used in this example, included as a reference.)
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            //console.log('didStartMonitoringForRegion:', pluginResult);

              //logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        // Called when monitoring and the state of a region changes.
        // (Not used in this example, included as a reference.)
        delegate.didDetermineStateForRegion = function (pluginResult) {
            //logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

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

    function displayBeaconList() {
        // Clear beacon list.
        $('#found-beacons').empty();

        var timeNow = Date.now();
        

        // Update beacon list.
        $.each(beacons, function (key, beacon) {
            // Only show beacons that are updated during the last 60 seconds.
            if (beacon.timeStamp + 60000 > timeNow) {
                // Map the RSSI value to a width in percent for the indicator.
                var rssiWidth = 1;// Used when RSSI is zero or greater.
                if (beacon.rssi <  - 100) {
                    rssiWidth = 100;
                }
                else if (beacon.rssi < 0) {
                    rssiWidth = 100 + beacon.rssi;
                }
                

                // Create tag to display beacon data.
                var element = $('<li>' + '<strong>UUID: ' + beacon.uuid + '</strong><br />' + 'Major: ' + beacon.major + '<br />' + 'Minor: ' + beacon.minor + '<br />' + 'Proximity: ' + beacon.proximity + '<br />' + 'RSSI: ' + beacon.rssi + '<br />' + '<div style="background:rgb(255,128,64);height:20px;width:' + rssiWidth + '%;"></div>' + '</li>');

                $('#warning').remove();
                $('#found-beacons').append(element);
            }
        });
    }

    return app;
})();

app.initialize();