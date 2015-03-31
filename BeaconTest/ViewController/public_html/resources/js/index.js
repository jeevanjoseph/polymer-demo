var app = (function() {
  // Application object.
  var app = {};

  var offers = [{
        "offer_id": "20FORTWO",
        "offer_title": "$20 for Dinner For Two",
        "offer_detail": " Get Dinner for 2, including an appetizer to share, two entrees and a dessert, all for $20",
        "expires": "15-sept-2014",
        "beacon_uuid": "2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6",
        "beacon_major": "1",
        "beacon_minor": "1"
      },
      {
        "offer_id": "FIRSTDRINKFREE",
        "offer_title": "Your first drink is free",
        "offer_detail": " Choose from our wide range of cocktails, fine wines or scotch. The first drink is on us !",
        "expires": "15-sept-2014",
        "beacon_uuid": "B9407F30-F5F8-466E-AFF9-25556B57FE6D"
      },
      {
        "offer_id": "FREEAPP",
        "offer_title": "Free Appetizer Today",
        "offer_detail": "Get an appetizer to share on anhy party of 2 or more.",
        "expires": "15-sept-2014",
        "beacon_uuid": "2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6",
        "beacon_major": "1",
        "beacon_minor": "3"
      },
      {
        "offer_id": "offerid",
        "offer_title": "Half off on Shrimp Scampi",
        "offer_detail": "",
        "beacon_uuid": "2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6"

      }

    ]
    // array of beacons.
  var beacons = {};
  // array of beacons.
  var offerMap = {};

  app.initialize = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
  };

  function onDeviceReady() {
    // Specify a shortcut for the location manager holding the iBeacon functions.
    window.locationManager = cordova.plugins.locationManager;

    setupZones(offers);

    // Start tracking beacons!
    startScan();
    //setInterval(notifyTest,3000);

  }

  function setupZones(regionArray) {
    for (var i in regionArray) {
        if(regionArray[i].beacon_major != undefined && regionArray[i].beacon_minor != undefined){
          var key = regionArray[i].beacon_uuid + regionArray[i].beacon_major + regionArray[i].beacon_minor;
        }else if(regionArray[i].beacon_major != undefined){
          var key = regionArray[i].beacon_uuid + regionArray[i].beacon_major;
        }else{
          var key = regionArray[i].beacon_uuid;
        }
      console.log("Adding zone.."+key)
      offerMap[key] = regionArray[i];

    }
  }


  function startScan() {
    // The delegate object holds the iBeacon callback functions
    // specified below.
    var delegate = new locationManager.Delegate();

    // Called continuously when ranging beacons.
    delegate.didRangeBeaconsInRegion = function(pluginResult) {
      //console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
      setbData('#bdata_uuid', pluginResult.beacons);
      for (var i in pluginResult.beacons) {
        if (pluginResult.beacons.size > 0) {
          $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/connected.png");
        } else {
          $("#status").attr("src", "../FARs/ViewController/public_html/resources/img/not-connected.png");
        }

      }

    };

    // Called when starting to monitor a region.
    // (Not used in this example, included as a reference.)
    delegate.didStartMonitoringForRegion = function(pluginResult) {
      //console.log('didStartMonitoringForRegion:', pluginResult);
      //logToDom('[****] didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
      setbData('#bdata_uuid', pluginResult.beacons);

    };

    // Called when monitoring and the state of a region changes.
    // state can be: UnKnown, Inside or Outside
    delegate.didDetermineStateForRegion = function(pluginResult) {
      //logToDom('[****] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
      //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

    };

    delegate.didExitRegion = function(pluginResult) {
      // logToDom('[DOM] didExitRegion: ' + JSON.stringify(pluginResult));
      // createLocalNotification("Exited " + JSON.stringify(pluginResult));
      var beacon = pluginResult.region;
      beacon.timeStamp = Date.now();
      var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
      beacons[key] = null;

      //notify(beacon, "Exiting  ");

    };

    delegate.didEnterRegion = function(pluginResult) {
      //logToDom('[DOM] didEnterRegion: ' + JSON.stringify(pluginResult));
      // createLocalNotification("Entered " + JSON.stringify(pluginResult));
      var beacon = pluginResult.region;
      beacon.timeStamp = Date.now();
      console.log('[INSIDE] didEnterRegion: ' + JSON.stringify(pluginResult));
      //logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult.beacons[i]));
      notify(beacon, "Entering ");
    };

    delegate.monitoringDidFailForRegionWithError = function(pluginResult) {
     console.log('[DOM] monitoringDidFailForRegionWithError: ' + JSON.stringify(pluginResult));

    };

    // Set the delegate object to use.
    locationManager.setDelegate(delegate);

    // Request permission from user to access location info.
    // This is needed on iOS 8.
    locationManager.requestAlwaysAuthorization();

    // Start monitoring and ranging beacons.
    for (var i in offers) {
    console.log("Creating region : "+offers[i].offer_id, offers[i].beacon_uuid, offers[i].beacon_major, offers[i].beacon_minor);
      var beaconRegion = new locationManager.BeaconRegion(offers[i].offer_id, offers[i].beacon_uuid, offers[i].beacon_major, offers[i].beacon_minor);

      // Start ranging.
      //locationManager.startRangingBeaconsInRegion(beaconRegion).fail(console.error).done();

      // Start monitoring.
      locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
    }
  }

  function notify(beacon, msg) {
    var key = beacon.uuid.toUpperCase() + beacon.major + beacon.minor;
    var zonedOffer = offerMap[key];
    if(zonedOffer == null){ // checking for null and undefined
      // A speficif offer from this beaco does not seem to exist. widening search
      key = beacon.uuid.toUpperCase() + beacon.major;
      zonedOffer = offerMap[key];
      if(zonedOffer == null){// widening to a particular beacon
        key = beacon.uuid.toUpperCase();
        zonedOffer = offerMap[key];
      }
    }
    //alert(zonedOffer.offer_title);
    //if(zonedOffer != null){
      adf.mf.api.localnotification.add({
          "title": zonedOffer.offer_title, // Notification title (Android ONLY)
          "alert": zonedOffer.offer_detail, // Notification alert text
          "sound": "SYSTEM_DEFAULT", // If set, the default system sound will be played
          "vibration": "SYSTEM_DEFAULT"
        },
        function(request, response) {
          console.log("notification fired");
        },
        function(request, response) {
          console.log("notification failed");
        });
    //}

  };

  function notifyTest(){
    adf.mf.api.localnotification.add({
        "title": "Sample Title", // Notification title (Android ONLY)
        "alert": "Alert Text for the alert", // Notification alert text
        "sound": "SYSTEM_DEFAULT", // If set, the default system sound will be played
        "vibration": "SYSTEM_DEFAULT"
      },
      function(request, response) {
        console.log("notification fired");
      },
      function(request, response) {
        console.log("notification failed");
      });
  };

  return app;
})();

app.initialize();

var setbData = function(compid, beacons) {
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
