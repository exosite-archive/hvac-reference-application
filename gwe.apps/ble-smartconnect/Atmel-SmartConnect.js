//
"use strict";
var NobleDevice = require('noble-device');

// UUIDs
var SmartConnectService_UUID = 'F05ABAC0393611E587A60002A5D5C51B';
var SmartConnectEnvData_UUID = 'F05ABAD0393611E587A60002A5D5C51B';
var SmartConnectEnvODR_UUID = 'F05ABAD1393611E587A60002A5D5C51B';

var SmartConnect = function(peripheral){

	NobleDevice.call(this, peripheral);
};

SmartConnect.SCAN_UUIDS = [SmartConnectService_UUID];

/*
// and/or specify method to check peripheral (optional)
SmartConnect.is = function(peripheral) {
	return (peripheral.advertisement.localName === 'My Thing\'s Name');
};
*/

SmartConnect.prototype.notifyEnvionment = function(callback) {
	// TODO:
}

SmartConnect.prototype.unnotifyEnvionment = function(callback) {
	// TODO:
}

SmartConnect.prototype.setEnvionmentDataRate = function(rate, callback) {
	// TODO:
	this.writeUint8Characteristic(SmartConnectService_UUID, SmartConnectEnvODR_UUID, 1, callback);
}



// inherit noble device
NobleDevice.Util.inherits(SmartConnect, NobleDevice);

// you can mixin other existing service classes here too,
// noble device provides battery and device information,
// add the ones your device provides
NobleDevice.Util.mixin(SmartConnect, NobleDevice.BatteryService);
NobleDevice.Util.mixin(SmartConnect, NobleDevice.DeviceInformationService);

// export your device
module.exports = SmartConnect;


//	vim: set sw=4 ts=4 :
