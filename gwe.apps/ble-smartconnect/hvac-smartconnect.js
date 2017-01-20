#!/usr/bin/env node
//
"use strict";
var SensorTag = require('sensortag');
var exec = require('child_process').exec;
var async = require('async');
var https = require("follow-redirects").https;
var urllib = require("url");
var querystring = require("querystring");

var CIK = null;
var Tags = [];
var productID = "";

function sendUp(temperature, humidity) {
	var opts = urllib.parse('https://'+productID+'m2.exosite.com/onep:v1/stack/alias');
	opts.method = 'POST';
	opts.headers = {};
	opts.headers['X-Exosite-CIK'] = CIK;
	opts.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';

	var payload = querystring.stringify({temperature: temperature, humidity: humidity});
	opts.headers['content-length'] = Buffer.byteLength(payload);

	console.log("Sending:", productID, ">>", payload);

	var req = https.request(opts, function(result){
		result.on('data', function (chunk) {});
		result.on('end',function() {
		});
	});
	req.on('error',function(err) {
		console.log("http write error: ", err);
	});
	req.write(payload);
	req.end();
}

console.log("Begins.");

async.series([
	function(callback) {
		exec("gwe -C", function(err, stdout, stderr){
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
						//console.log("UPDATE: ", temperature, humidity);
						sendUp(temperature, humidity);
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
