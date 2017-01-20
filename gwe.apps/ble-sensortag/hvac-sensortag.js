//
"use strict";
var SensorTag = require('sensortag');
//var async = require('async');


var Tags = [];
SensorTag.discoverAll(function(st) {
	console.log("Discovered: ", st.type, " - ", st.id);
	st.connectAndSetup(function(err){
		if (err) {
			console.log("Failed to connect and setup tag: ", err);
		} else {
			st.on('humidityChange', function(temperature, humidity) {
				console.log("UPDATE: ", temperature, humidity);
			});
			st.enableHumidity(function(err){
				if (err) {
					console.log("Failed to connect and setup tag: ", err);
				} else {
					st.setHumidityPeriod(10, function(err){
						if (err) {
							console.log("Failed to set period: ", err);
						}
						st.nofifyHumidity(function(err){
							if (err) {
								console.log("Failed to enable notify: ", err);
							}
						});
					});
				}
			});
			Tags.push(st);
		}
	});

});

//	vim: set ai sw=2 ts=2 :
