import subprocess
import time

import requests

from Adafruit_I2C import Adafruit_I2C

ADDR_TH02 = 0x40
BUS_TH02 = 2

REG_ADDR_STATUS = 0x00
REG_ADDR_CONFIG = 0x03
REG_ADDR_DATAH = 0x01
REG_ADDR_DATAL = 0x02
REG_ADDR_ALERT = 0x01
REG_ADDR_LIMITL = 0x03
REG_ADDR_LIMITH = 0x04
REG_ADDR_HYST = 0x05

getData = int()
analogVal = int()

       

class I2C_TH02():
    def __init__(self):
        self.i2c = Adafruit_I2C(ADDR_TH02, BUS_TH02)
        self.cik = subprocess.Popen(["gwe", "-C"], stdout=subprocess.PIPE).communicate()[0].rstrip()
        
    def conv_temp(self):
        self.i2c.write8(REG_ADDR_CONFIG, 0x11)
        time.sleep(0.25)
        while self.conv_ready == False:
            pass
        d1 = self.i2c.readU8(REG_ADDR_DATAH) << 8
        d2 = self.i2c.readU8(REG_ADDR_DATAL)
        temp = d1 | d2
        temp = temp >> 2
        temp /= 32
        temp -= 50
        return temp
        
    def conv_humidity(self):
        self.i2c.write8(REG_ADDR_CONFIG, 0x01)
        time.sleep(0.25)
        while self.conv_ready == False:
            pass
        d1 = self.i2c.readU8(REG_ADDR_DATAH) << 8
        d2 = self.i2c.readU8(REG_ADDR_DATAL)
        humi = d1 | d2
        humi = humi >> 4
        humi /= 16
        humi -= 24
        return humi
        
    def conv_ready(self):
        conv_status = self.i2c.read8(REG_ADDR_STATUS)
        if conv_status == 0:
            return True
        else:
            return False
        
    def read_adc(self):     
        data = self.i2c.readS16(REG_ADDR_RESULT)      
        return data
        
    def upload_data(self, temp, humi):
        data = {'temperature': temp, 'humidity': humi}
        headers = {'X-Exosite-CIK': self.cik}
        exo_req = requests.post('https://m2.exosite.com/onep:v1/stack/alias?state', data=data, headers=headers)
        
if __name__=="__main__":
    th02 = I2C_TH02()
    while True:
        temp = th02.conv_temp()
        print("{}c".format(temp))
        humi = th02.conv_humidity()
        print("{}%".format(humi))
        exo_req = th02.upload_data(temp, humi)
        time.sleep(5)
        
