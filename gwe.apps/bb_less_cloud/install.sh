#!/bin/sh
# Turn off things

ITEMS="apache2.service cloud9.service cloud9.socket node-red.service node-red.socket"

for item in $ITEMS; do
	systemctl disable $item
	systemctl stop $item
done

#  vim: set sw=4 ts=4 :
