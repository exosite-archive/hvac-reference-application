#!/usr/bin/python
import subprocess
import time

#import requests
from exo.api import ExositeAPI

from Adafruit_I2C import Adafruit_I2C

HDC1000_ADDR=0x40

HDC1000_TEMP=0x00
HDC1000_HUMI=0x01
HDC1000_CONFIG=0x02

BUS_ID = 2

class I2C_HDC1000():
    def __init__(self):
        self.i2c = Adafruit_I2C(HDC1000_ADDR, BUS_ID)
        # Configure with Heater on, Read Temp and Humidity.
        self.i2c.writeList(HDC1000_CONFIG, [0x30,0])
        #
        self.cik = subprocess.Popen(["gwe", "-C"], stdout=subprocess.PIPE).communicate()[0].rstrip()
        self.api = ExositeAPI(cik=self.cik)

    def readTempHum(self):
        self.i2c.bus.write_byte(HDC1000_ADDR, HDC1000_TEMP)
        sleep(0.02) # Atleast 20ms.
        data = i2c.bus.read_byte(HDC1000_ADDR) << 8
        data += i2c.bus.read_byte(HDC1000_ADDR)
        temp = data/65536.0 * 165.0 - 40.0

        self.i2c.bus.write_byte(HDC1000_ADDR, HDC1000_HUMI)
        sleep(0.02) # Atleast 20ms.
        data = i2c.bus.read_byte(HDC1000_ADDR) << 8
        data += i2c.bus.read_byte(HDC1000_ADDR)
        humi = data/65536.0 * 100.0

        return (temp, humi)

    def upload_data(self, temp, humi):
        data = {'temperature': temp, 'humidity': humi}
        return self.api.http_write_multiple(data)

if __name__=="__main__":
    hdc = I2C_HDC1000()
    while True:
        th = hdc.readTempHum()
        print(th)
        exo_req = hdc.upload_data(th[0], th[1])
        time.sleep(5)

#  vim: set ai et sw=4 ts=4 :
