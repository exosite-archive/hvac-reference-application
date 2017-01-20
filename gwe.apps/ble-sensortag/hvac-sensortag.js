#!/usr/bin/env node
//
"use strict";
var SensorTag = require('sensortag');
var exec = require('child_process').exec;
var async = require('async');

var CIK = null;
var Tags = [];

console.log("Begins.");

async.series([
	function(callback) {
		exec("gwe -C", function(err, stderr, stdout){
			if (err) {
				return callback(err, null);
			}
			CIK = stdout.trim();
			callback(null, CIK);
		});
	},
	function(callback) {
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
	}
]);

//	vim: set ai sw=2 ts=2 :
