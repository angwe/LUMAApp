$(document).ready( function () {
		
	$("#layers").append("<p>Text added</p>");
	
	
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

	var pathAnimate = function (marker) {
		var startPoint;
		var endPoint;
		
		if (marker.letter.origin === '') {
			startPoint = StLouis;
		} else {
			var sp = marker.letter.origin.replace(/ /g,'').split(',');
			startPoint = new google.maps.LatLng(sp[0],sp[1]);
		}
		
		//console.log("startPoint is ", startPoint, " while letter.origin is ", marker.letter.origin, ".");
		//console.log(startPoint instanceof google.maps.LatLng);
		
		var ep = marker.letter.location.replace(/ /g,'').split(',');
		endPoint = new google.maps.LatLng(ep[0],ep[1]);
		
		var aniMarkerOpts = {
			position: startPoint,
			visible: true,
			icon: './mapbox-maki/src/post-24.svg',
			markerType: 'animation',
		};
		
		var aniMarker = $('#map-canvas').gmap('addMarker', aniMarkerOpts);
		
		aniMarker['0'].animateTo(endPoint, {easing: "easeInOutCubic"});
		
	};
				
			
	
	var animateLetters = function () {
		var period = 1000; // ms
		var markerIndex = 0;
		var stopLoop = Object.keys(markerObjects).length;
		var tmpMarker = markerObjects[markerIndex].val(this);
		//pathAnimate(tmpMarker['0']);
		(function myLoop (i) {          
				setTimeout(function () {   
						var marker = markerObjects[markerIndex].val(this);
						pathAnimate(marker['0']);
						marker['0'].set('visible', true);
						markerIndex++;
						if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
				}, period)
		})(stopLoop); //anonymous function called with the number of iterations as the argument
	};
		
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

	$("#layers").append("<p>Layers on/off will be here</p>");
	
		var fullQuery = encodeURI("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM 1eja-Sf9fKtfUyWs7gbPVeXC8O45JbIVjWiEtZDE WHERE Location > '' ORDER BY Date&key=AIzaSyCCiTJbrAoe15VipHG5QA2YkMjL3FTgq5Q&typed=true&callback=?");

	var letterObjects = {};
	var markerObjects = {};
	
	
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
					origin: data[i][7]
				};
				letterObjects[i] = letter;
				markerObjects[i] = $('#map-canvas').gmap('addMarker', {
					'position': letter.location,
					'bounds':'false',
					'animation':'none',
					'optimized':'false',
					'icon': './mapbox-maki/src/post-24.svg',
					'visible': false,
					'letter':letter,
					'markerType':'letter'
				});
			};
			for (var j in Object.keys(markerObjects)) {
				markerObjects[j].click(function () {
					infoWindow(this);
				});
				markerObjects[j].dblclick(function () {
						pathAnimate(this);
				});
			};
		},
		error: function () { alert("AJAX error!") }
	});

		
	$("#AddMarkers").click(function () {
		
		$('#controls').append("<p>Click an icon to see the info. Double-click to see the delivery path. (Animation shows when click Add Path.)</p>");
		animateLetters();
		
	});
	
	$("#ClearAnimations").click(function () {
			
			$('#map-canvas').gmap('find', 'markers', { 'property': 'markerType', 'value': 'animation' }, function(marker, found) {
					marker.setVisible(found);
			});
	});
		
});
