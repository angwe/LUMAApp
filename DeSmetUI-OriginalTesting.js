$(document).ready( function () {
		
	$("#layers").append("<p>Text added</p>");
	
	var letterObjects = {};
	var markerObjects = {};
	
	var basicTest = encodeURI("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Type FROM 1m_zdoEY-EE81h4bjZYNkAAtHeiMmmkuBX5S5VB8 WHERE Card = 'Glasses of Urza'&key=AIzaSyCCiTJbrAoe15VipHG5QA2YkMjL3FTgq5Q&typed=true&callback=?");
	
	var myString;
	var StLouis = new google.maps.LatLng(38.78587,-90.326206);
	
	var infoWindow = function (marker) {
		$('#map-canvas').gmap('openInfoWindow', {'content': "Sent to " + marker.letter.recipient + " on " + marker.letter.date + "."}, marker);
		return;
	};
	
	var pathRender = function (marker) {
		var startPoint = marker.letter.location.replace(/ /g,'').split(',');
		startPoint = new google.maps.LatLng(startPoint[0],startPoint[1]);
		var PathOpts = {
			path: [startPoint,StLouis],
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 5
		};
		$('#map-canvas').gmap('addShape', 'Polyline', PathOpts);
	};
	
	var animateLetters = function () {
		var period = 1000; // ms
		var markerIndex = 0;
		var stopLoop = Object.keys(markerObjects).length;
		(function myLoop (i) {          
				setTimeout(function () {   
						var marker = markerObjects[markerIndex].val(this);
						marker['0'].set('visible', true);
						console.log(marker['0'].letter.date);
						markerIndex++;
						if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
				}, period)
		})(stopLoop); //anonymous function called with the number of iterations as the argument
	};
	
	$.ajax({
		type: "GET",
		url: basicTest,
		dataType: "jsonp",
		success: function (jsonResp) {
			var data = jsonResp['rows'];
			myString = data[0][0];
		},
		error: function () { alert("AJAX error!") }
	});
	
	var testQuery = encodeURI("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1eja-Sf9fKtfUyWs7gbPVeXC8O45JbIVjWiEtZDE WHERE Recipient = 'Campbell'&key=AIzaSyCCiTJbrAoe15VipHG5QA2YkMjL3FTgq5Q&typed=true&callback=?");
	
	var testLatLng = [];
	
	$.ajax({
		type: "GET",
		url: testQuery,
		dataType: "jsonp",
		success: function (jsonResp) {
			var data = jsonResp['rows'];
			testLatLng.push(data[0][6]);
		},
		error: function () { alert("AJAX error!") }
	});
	


		
	var mapOptions = {
       center: new google.maps.LatLng(47, -114),
       zoom: 8,
       mapTypeId: google.maps.MapTypeId.TERRAIN,
       mapControl: true,
       mapTypeControlOptions: {
       	 position: google.maps.ControlPosition.TOP_CENTER,
       	 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
       	 MapTypeIds: (google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN)
       }
   };
		
   $("#map-canvas").gmap(mapOptions);
	var myMap = $("#map-canvas").gmap('get','map');
		
	var Missoula = new google.maps.LatLng(46.870,-114.019);
	$("#layers").append("<p>Missoula position " + Missoula.toString() + "</p>");

	var GreatFalls = new google.maps.LatLng(47.506,-111.305);


		
	$("#AddMarker").click(function () {
		/*var Marker1 = $("#map-canvas").gmap('addMarker', {'position': '47,-114', 'animation': google.maps.Animation.DROP});
		Marker1.click(function () {
			$('#map-canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
		});
		var Marker2 = $('#map-canvas').gmap('addMarker', {'position': GreatFalls,'bounds':'false','animation':google.maps.Animation.DROP});
		var Marker3 = $('#map-canvas').gmap('addMarker', {'position': Missoula,'bounds':'false', 'animation': google.maps.Animation.DROP});
		Marker3.click(function () {
				$('#map-canvas').gmap('openInfoWindow', {'content': myString}, this);
		});
		var Marker4 = $('#map-canvas').gmap('addMarker', {'position': testLatLng[0], 'bounds':'false'});*/
		var fullQuery = encodeURI("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1eja-Sf9fKtfUyWs7gbPVeXC8O45JbIVjWiEtZDE WHERE Location > '' ORDER BY Date&key=AIzaSyCCiTJbrAoe15VipHG5QA2YkMjL3FTgq5Q&typed=true&callback=?");
	

		
		$.ajax({
			type: "GET",
			url: fullQuery,
			dataType: "jsonp",
			success: function (jsonResp) {
				var data = jsonResp['rows'];
				for (var i in data) {
					var letter = {
						date: data[i][0],
						author: data[i][1],
						recipient: data[i][2],
						locationName: data[i][3],
						information: data[i][4],
						location: data[i][6],
					};
					letterObjects[i] = letter;
					markerObjects[i] = $('#map-canvas').gmap('addMarker', {
						'position': letter.location,
						'bounds':'false',
						'animation':'none',
						'optimized':'false',
						/*'icon': {
							path: postPath,
							fillColor: 'blue',
							fillOpacity: 0.5
						},*/
						'icon': './mapbox-maki/src/post-24.svg',
						'visible': false,
						'letter':letter
					});
				};
				for (var j in Object.keys(markerObjects)) {
					markerObjects[j].click(function () {
						infoWindow(this);
					});
					markerObjects[j].dblclick(function () {
							pathRender(this);
					});
				};
			},
			error: function () { alert("AJAX error!") }
		});
		
		$('#controls').append("<p>Click an icon to see the info. Double-click to see the delivery path. (Animation not currently setup.)</p>");
	});
		
	$("#AddPath").click(function() {
			animateLetters();
			
			/*var PathOpts = {
				path: [new google.maps.LatLng(47,-114),GreatFalls,Missoula],
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 5
			};
			$("#map-canvas").gmap('addShape', 'Polyline', PathOpts);*/
	});
	
	$("#AddFusion").click(function() {
			$('#map-canvas').gmap('loadFusion', {
				query: {
					select: 'Location',
					'from': '1eja-Sf9fKtfUyWs7gbPVeXC8O45JbIVjWiEtZDE'
				},
				styles: [{
						markerOptions: {
							iconName: "post_office"
						}
				}],
				suppressInfoWindows: true
			});
	});

});
