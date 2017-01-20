#!/bin/sh

# Install requirements for BLE in python
apt-get install -y build-essential bluetooth bluez libbluetooth-dev libudev-dev
npm install -g noble async

# install
mkdir -p /usr/local/bin

#cp -f th02.py /usr/local/bin/

