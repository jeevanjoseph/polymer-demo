var app = {

    // Setup data. We will want to call a REST service to get this array later on.
    watchedRegions : [{id : 'Jeevan Office', uuid : '2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6', major : 1, minor : 1, notifyEntryStateOnDisplay : true}],
    
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
        alert('indevice ready Fired');
        //setup delegate
        app.setupDelegate();
        
        // Create beacon regions for all watched region defs and start both ranging(foreground) and monitoring(background)
        for (var idx in watchedRegions){
            var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(watchedRegions[idx].id, 
                                                                    watchedRegions[idx].uuid, 
                                                                    watchedRegions[idx].major, 
                                                                    watchedRegions[idx].minor);
            // startMonitoringForRegion -- startRangingBeaconsInRegion
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail('ERROR' + console.error)
                .done();
            // Start monitoring as well. this works in the background as well.    
            cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                .fail(console.error)
                .done();
        }
    },
    setupDelegate : function() {
        alert('setupDelegate fired');
        var delegate = new cordova.plugins.locationManager.Delegate().implement({

            didDetermineStateForRegion: function (pluginResult) {
            alert('didDetermineStateForRegion');
                console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
                setbData('#bdata', 'didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
                adf.mf.api.localnotification.add({
                                                      "title"     :  "Title",                  // Notification title (Android ONLY)
                                                      "alert"     :  pluginResult.state,                 // Notification alert text
                                                      "sound"     :  "SYSTEM_DEFAULT",       // If set, the default system sound will be played
                                                      "vibration" :  "SYSTEM_DEFAULT"        
                                                    },
                                                    function(request,response){alert("notification successful")},
                                                    function(request,response){alert("notification failed")});
            },

            didStartMonitoringForRegion: function (pluginResult) {
             alert('didStartMonitoringForRegion');
               console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
               setbData('#bdata', 'didStartMonitoringForRegion: ' + JSON.stringify(pluginResult));
            },

            didRangeBeaconsInRegion: function (pluginResult) {
                 alert('didRangeBeaconsInRegion');
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
        cordova.plugins.locationManager.requestAlwaysAuthorization();    
    }
};

app.initialize();

var setbData = function(compid,message) {
    $(compid).html(message);
};

var setLog = function(message) {
    $('#outmsg').html(message);
};        