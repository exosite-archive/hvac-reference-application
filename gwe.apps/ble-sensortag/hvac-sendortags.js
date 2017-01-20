//
"use strict";
//var noble = require('noble');


class SensorTag {
	static decimalToHex(decimal, chars) {
		return (decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase();
	}
	static sensorTagUUID_gen(idv) {
		return SensorTag.decimalToHex(0xF0000000+idv,8) + "-0451-4000-b000-000000000000";
	}

	// Constructor
	constructor(peripheral) {
		this._peripheral = peripheral;
		this._service = null;
		this._controlCharacteristic = null;
		this._dataCharacteristic = null;

		this._lastTemperature = 0;
		this._lastHumidity = 0;
	};

	// Methods
	connect(callback) {
		this._peripheral.connect(function(err){
			this._peripheral.discoverServices(SensorTag.services, function(err, services) {
				services.forEach(function(service){
					console.log('found service: ', service.uuid);
					service.discoverCharacteristics([], function(err, characteristics) {
						characteristics.forEach(function(characteristic) {
							// Loop through each characteristic and match them to the
							// UUIDs that we know about.
							console.log('found characteristic:', characteristic.uuid);

							if (SensorTag.HumidityDataUUID == characteristic.uuid) {
								this._dataCharacteristic = characteristic;
							} else if (SensorTag.HumidityControlUUID == characteristic.uuid) {
								this._controlCharacteristic = characteristic;
							}
						});

						if(this._dataCharacteristic && this._controlCharacteristic) {
							console.log("ready");
							if (callback) {
								callback(this);
							}
						} else {
							console.log("Missing characteristics!!");
						}

					});
				});
			});
		});
	}

	disconnect() {
		if (this._dataCharacteristic || this._controlCharacteristic) {
			this._peripheral.disconnect(function(err) {
				if (err) {
					console.log("Err disconnecting: ", err);
				}
				this._dataCharacteristic = null;
				this._controlCharacteristic = null;
			});
		}
	}

	enable() {
		if (this._controlCharacteristic && this._dataCharacteristic) {
			// Collect Data!
			var buff = new Buffer(1);
			buff.writeUInt8(1);
			this._controlCharacteristic.write(buff, false, function(err){
				if (err) {
					console.log("Error writing enable: ", err);
				}
				// subscribe to notifications
				this._dataCharacteristic.on('read', function(data, isNote){
					if(data.length > 1) {
						var rTemp = data.readUInt8(0);
						var rHum = data.readUInt8(1);
						this._lastTemperature = -46.85 + 175.72 * (rTemp / 65536.0)
						this._lastHumidity = -6.0 + 125.0 * ((rHum & 0xFFFC)/65536.0)
					} else {
						console.log("Short read!");
					}
				});
				this._dataCharacteristic.subscribe(function(err){
					if (err) {
						console.log("Error subscribing to data: ", err);
					}
				});
			});
		} else {
			console.log("Not ready to be enabled.");
		}
	}

	disable() {
		if (this._controlCharacteristic && this._dataCharacteristic) {
			var buff = new Buffer(1);
			buff.writeUInt8(0);
			this._controlCharacteristic.write(buff, false, function(err){
				if (err) {
					console.log("Error writing disable: ", err);
				}
			});
			this._dataCharacteristic.unsubscribe(function(err){
				if (err) {
					console.log("Error unsubscribing: ", err);
				}
			});
		} else {
			console.log("Not ready to be disabled.");
		}
	}

	latest() {
		return [this._lastTemperature, this._lastHumidity];
	};

}
// Add static vars.
SensorTag.HumidityServiceUUID = SensorTag.sensorTagUUID_gen(0xaa20);
SensorTag.HumidityDataUUID = SensorTag.sensorTagUUID_gen(0xaa21);
SensorTag.HumidityControlUUID = SensorTag.sensorTagUUID_gen(0xaa22);
SensorTag.services = [SensorTag.HumidityServiceUUID];

console.log("g: ", SensorTag.services);


var Tags = [];
noble.on('discover', function(peripheral) {
	console.log('found peripheral:', peripheral.advertisement);

	var st = new SensorTag(peripheral);
	Tags.push(st);
	st.connect(function(st) {
		st.enable();
	});
});

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		console.log('scanning...');
		noble.startScanning(SensorTag.services, false);

		Timeout.setInterval(function(){
			Tags.forEach(function(tag){
				console.log("a: ", tag.latest());
			});
		}, 5000); // every five seconds.
	} else {
		noble.stopScanning();
	}
});

//	vim: set ai sw=2 ts=2 :
