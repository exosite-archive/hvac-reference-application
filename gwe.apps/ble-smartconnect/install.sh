#!/bin/sh

# Install requirements for BLE in node.
apt-get install -y build-essential bluetooth bluez libbluetooth-dev libudev-dev libcap2-bin

# Allow non-root nodejs to scan BLE
setcap cap_net_raw+eip $(eval readlink -f `which node`)

# install
npm install -g .

#  vim: set sw=4 ts=4 :
