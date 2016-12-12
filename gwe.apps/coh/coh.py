#!/usr/bin/python
import subprocess
import time
import urlparse

from exo.api import ExositeAPI
import Adafruit_BBIO.GPIO as GPIO

COOL_PIN = "P9_14"
HEAT_PIN = "P9_16"

class CoolOrHeat():
  def __init__(self):
    self.cik = subprocess.Popen(["gwe", "-C"], stdout=subprocess.PIPE).communicate()[0].rstrip()
    self.api = ExositeAPI(cik=self.cik)
    GPIO.setup(COOL_PIN, GPIO.OUT)
    GPIO.setup(HEAT_PIN, GPIO.OUT)

  def waitForData(self):
    return self.api._http_long_poll('change', 300000)

  def readData(self):
    return self.api.http_read(['ac_on','heat_on'])

  def twiddleBits(self, data):
    d = urlparse.parse_qs(data.body)
    if u'heat_on' in d:
      if u'1' in d[u'heat_on']:
        GPIO.output(HEAT_PIN, GPIO.HIGH)
      else:
        GPIO.output(HEAT_PIN, GPIO.LOW)
    if u'ac_on' in d:
      if u'1' in d[u'ac_on']:
        GPIO.output(COOL_PIN, GPIO.HIGH)
      else:
        GPIO.output(COOL_PIN, GPIO.LOW)


if __name__=="__main__":
  ch = CoolOrHeat()
  print("Begin")
  ret = ch.readData()
  print(ret)
  if ret.code == 200:
    ch.twiddleBits(ret)
  while True:
    ret = ch.waitForData()
    print(ret)
    if ret.code == 200:
      ret = ch.readData()
      print(ret)
      if ret.code == 200:
        ch.twiddleBits(ret)
    time.sleep(5)

#  vim: set ai et sw=2 ts=2 :
