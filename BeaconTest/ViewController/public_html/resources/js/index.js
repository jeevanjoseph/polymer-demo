var app = {
    // Application Constructor
    initialize: function() {
    alert(initialize);
        this.bindEvents();
    },
    bindEvents: function() {
    alert(bindEvents);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onPause: function() {
        console.log('onPause()');
    },
    onResume: function() {
        console.log('onResume()');
    },
    onDeviceReady: function() {
        console.log('onDeviceReady()');
        var uuid = 'EB9AB493-32C2-4E5C-BF67-76E86E338BB9'; // mandatory
        var identifier = 'mobile'; // mandatory
        var minor = 1; // optional, defaults to wildcard if left empty
        var major = 1; // optional, defaults to wildcard if left empty

        // throws an error if the parameters are not valid
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        var delegate = new cordova.plugins.locationManager.Delegate().implement({

            didDetermineStateForRegion: function (pluginResult) {
                console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            },

            didStartMonitoringForRegion: function (pluginResult) {
               console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
            },

            didRangeBeaconsInRegion: function (pluginResult) {
                console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
                var beacon = pluginResult.beacons[0];
                var found = false;
                
                    if(beacon.major === major) {
                        console.log('Beacon in range');
                        

                        if(beacon.proximity === "ProximityNear") {
                            console.log('Proximity Near');
                        } else if(beacon.proximity === "ProximityFar"){
                            console.log('Proximity far');
                        }

                    } 
                    
                }); 

                if(found) {
                    $("#status").attr("src","../resources/photos/connected.png");
                } else {
                    console.log('Beacon not in range');
                    setLog('Beacon not in range...');
                    $("#status").attr("src","../resources/photos/not-connected.png");
                }
            }
        });

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        //cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        cordova.plugins.locationManager.requestAlwaysAuthorization()

        // startMonitoringForRegion -- startRangingBeaconsInRegion
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail('ERROR' + console.error)
            .done();
    }
};

app.initialize();

var setLog = function(message) {
    $('#log').html(message);
};        