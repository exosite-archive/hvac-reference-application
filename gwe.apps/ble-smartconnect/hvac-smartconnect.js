#!/usr/bin/env node
'use strict';
var SmartConnect = require('./Atmel-SmartConnect');
var exec = require('child_process').exec;
var async = require('async');
var https = require('follow-redirects').https;
var urllib = require('url');
var querystring = require('querystring');

var CIK = null;
var Tags = [];
var productID = '';

function sendUp(temperature, humidity) {
	var opts = urllib.parse('https://'+productID+'m2.exosite.com/onep:v1/stack/alias');
	opts.method = 'POST';
	opts.headers = {};
	opts.headers['X-Exosite-CIK'] = CIK;
	opts.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';

	var payload = querystring.stringify({temperature: temperature, humidity: humidity});
	opts.headers['content-length'] = Buffer.byteLength(payload);

	console.log('Sending:', productID, '>>', payload);

	var req = https.request(opts, function(result){
		result.on('data', function () {});
		result.on('end',function() { });
	});
	req.on('error',function(err) {
		console.log('http write error: ', err);
	});
	req.write(payload);
	req.end();
}

console.log('Begins.');

async.series([
	function(callback) {
		exec('gwe -C', function(err, stdout, stderr){
			if (err) {
				return callback(err, null);
			}
			if (stderr) {
				console.log('GWE stderr: ', stderr);
			}
			CIK = stdout.trim();
			callback(null, CIK);
		});
	},
	function(callback) {
		SmartConnect.discoverAll(function(st) {
			console.log('Discovered: ', st.type, ' - ', st.id);
			st.connectAndSetup(function(err){
				if (err) {
					console.log('Failed to connect and setup tag: ', err);
					callback(err, null);
				} else {
					console.log('Setup complete for ', st.id);
					st.on('environmentChange', function(temperature, pressure, uv, humidity) {
						console.log('UPDATE: ', temperature, pressure, uv, humidity);
						sendUp(temperature, humidity);
					});
					st.setEnvionmentDataRate(0, function(err){
						if (err) {
							console.log('Failed to set data rate: ', err);
						} else {
							console.log('Data rate set');
						}
						st.notifyEnvironment(function(err){
							if (err) {
								console.log('Failed to enable notify: ', err);
								callback(err, null);
							} else {
								console.log('Notify enabled');
								callback(null, 'ok');
							}
						});
					});
					Tags.push(st);
				}
			});
		});
	}
]);

//	vim: set ai sw=2 ts=2 :
