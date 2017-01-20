#!/usr/bin/env node
//
"use strict";
var SensorTag = require('sensortag');
//var async = require('async');

console.log("Begins.");
var Tags = [];
SensorTag.discoverAll(function(st) {
	console.log("Discovered: ", st.type, " - ", st.id);
	st.connectAndSetup(function(err){
		if (err) {
			console.log("Failed to connect and setup tag: ", err);
		} else {
			console.log("Setup complete for ", st.id);
			st.on('humidityChange', function(temperature, humidity) {
				console.log("UPDATE: ", temperature, humidity);
			});
			st.enableHumidity(function(err){
				if (err) {
					console.log("Failed to connect and setup tag: ", err);
				} else {
					console.log("Humidity enabled for ", st.id);
					st.setHumidityPeriod(5000, function(err){
						if (err) {
							console.log("Failed to set period: ", err);
						} else {
							console.log("Period set");
						}
						st.notifyHumidity(function(err){
							if (err) {
								console.log("Failed to enable notify: ", err);
							} else {
								console.log("Notify enabled");
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
