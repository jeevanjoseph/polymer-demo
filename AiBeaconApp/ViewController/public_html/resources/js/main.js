var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onPause: function() {
        console.log('onPause()');
        //alert("paused...");
    },
    onResume: function() {
        console.log('onResume()');
        //alert("onResume...");
    },
    onDeviceReady: function() {
        var uuid = 'EB9AB493-32C2-4E5C-BF67-76E86E338BB9'; // mandatory
        var identifier = 'macbookIbeacon'; // mandatory
        var minor = 1; 
        var major = 1; 

        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        var delegate = new cordova.plugins.locationManager.Delegate().implement({

            didDetermineStateForRegion: function (pluginResult) {
                console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
                setbData('#bdata', 'didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            },

            didStartMonitoringForRegion: function (pluginResult) {
               console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
               setbData('#bdata', 'didStartMonitoringForRegion: ' + JSON.stringify(pluginResult));
            },

            didRangeBeaconsInRegion: function (pluginResult) {
                console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
                var beacons = pluginResult.beacons;
                var found = false;
                beacons.forEach(function(beacon) {
                    if(beacon.major === major) {
                        console.log('Beacon in range');
                        setLog('Beacon is in range! (' + beacon.proximity + ')');
                        //setbData('#bdata', JSON.stringify(pluginResult));
                        setbData('#bdata_uuid', 'UUID: ' + beacon.uuid);
                        setbData('#bdata_min_maj', 'MINOR: ' + beacon.minor + ' MAJOR: ' + beacon.major);
                        setbData('#bdata_rssi_acc', 'RSSI: ' + beacon.rssi + ' ACCURACY: ' + beacon.accuracy);
                        if(beacon.proximity === "ProximityNear") {
                            console.log('Proximity Near');
                        } else if(beacon.proximity === "ProximityFar"){
                            console.log('Proximity far');
                        }

                        found = true;
                    }
                }); 

                if(found) {
                    $("#status").attr("src","../FARs/ViewController/public_html/resources/img/connected.png");
                } else {
                    console.log('Beacon not in range');
                    setLog('Beacon not in range...');
                    setbData('#bdata',"");
                    setbData('#bdata_uuid',"");
                    setbData('#bdata_min_maj',"");
                    setbData('#bdata_rssi_acc',"");
                    $("#status").attr("src","../FARs/ViewController/public_html/resources/img/not-connected.png");
                }
            }
        });

        cordova.plugins.locationManager.setDelegate(delegate);
        //cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        cordova.plugins.locationManager.requestAlwaysAuthorization()

        // startMonitoringForRegion -- startRangingBeaconsInRegion
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail('ERROR' + console.error)
            .done();
    }
};

app.initialize();

var setbData = function(compid,message) {
    $(compid).html(message);
};

var setLog = function(message) {
    $('#outmsg').html(message);
};        