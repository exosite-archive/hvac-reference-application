#!/usr/bin/python
import subprocess
import time

from exo.api import ExositeAPI
import Adafruit_BBIO.GPIO as GPIO

COOL_PIN = "P9_14"
HEAT_PIN = "P9_16"

class CoolOrHeat():
  def __init__(self):
    self.cik = subprocess.Popen(["gwe", "-C"], stdout=subprocess.PIPE).communicate()[0].rstrip()
    self.api = ExositeAPI(cik=self.cik)

    def waitForData(self):
      self.api._http_long_poll('change', 300000)
      #headers = {
      #    'X-Exosite-CIK': self.cik,
      #    'Request-Timeout': 30000
      #    }
      #requests.post('https://m2.exosite.com/onep:v1/stack/alias?change', headers=headers)

    def readData(self):
      self.api.http_read(['ac_on','heat_on'])
      #headers = {'X-Exosite-CIK': self.cik}
      #requests.post('https://m2.exosite.com/onep:v1/stack/alias?ac_on&heat_on', headers=headers)

if __name__=="__main__":
  ch = CoolOrHeat()
  while True:
    ret = ch.waitForData()
    print(ret)
    ret = ch.readData()
    print(ret)
    time.sleep(5)

#  vim: set ai et sw=2 ts=2 :
