#!/bin/python

import datetime
import math
import requests
import sys
import time

from exosite_python import Murano


class TimeKeeper(object):
    def __init__(self):
        self.now = datetime.datetime(2015, 6, 1)

    def increment_time(self):
        self.now = self.now + datetime.timedelta(minutes=15)


class Weather(object):
    def __init__(self, wuapi):
        self.min_temp = 15
        self.max_temp = 10
        self.min_humi = 10
        self.max_humi = 100
        self.ambient_temperature = 0
        self.ambient_humidity = 0
        self.precipitation = False
        self.wuapi = wuapi
        self.current_date = datetime.datetime(2014, 1, 1)

    def get_weather_location(self, lat, lon):
        # TODO: Set location based on lat long for future queries
        wurl = 'http://api.wunderground.com/api/{wuapi}/geolookup/q/{lat},{lon}.json'.format(wuapi=self.wuapi,
                                                                                             lat=lat, lon=lon)

    def set_weather_data(self, lat, lon, current_datetime):
        if self.current_date.year != current_datetime.year or self.current_date.month != current_datetime.month or self.current_date.day != current_datetime.day:
            self.current_date = datetime.datetime(current_datetime.year, current_datetime.month, current_datetime.day,
                                                  0, 0, 0)
            try:
                wr = requests.get(
                    'http://api.wunderground.com/api/{wuapi}/history_{yyyy:04d}{mm:02d}{dd:02d}/q/MN/Minneapolis.json'.format(
                        wuapi=self.wuapi,
                        yyyy=self.current_date.year,
                        mm=self.current_date.month,
                        dd=self.current_date.day
                    )
                )
                print(wr.content)

                self.min_temp = float(wr.json()['history']['dailysummary'][0]['mintempm'])
                self.max_temp = float(wr.json()['history']['dailysummary'][0]['maxtempm'])
                self.min_humi = float(wr.json()['history']['dailysummary'][0]['minhumidity'])
                self.max_humi = float(wr.json()['history']['dailysummary'][0]['maxhumidity'])
            except Exception as e:
                print("ERROR: Unable to obtain new weather data: {}".format(e))
                pass

        minutes = (current_datetime - self.current_date).seconds / 60.0
        self.ambient_temperature = round(self.set_ambient_temperature(minutes), 2)
        self.ambient_humidity = round(self.set_ambient_humidity(minutes), 2)

    def set_ambient_temperature(self, minutes):
        temp_percent = (-1.0 * math.sin(2.0 * math.pi * (float(minutes) / 1440.)) + 1.0) / 2.0
        return (self.max_temp - self.min_temp) * temp_percent + self.min_temp

    def set_ambient_humidity(self, minutes):
        humi_percent = (-1.0 * math.sin(2.0 * math.pi * (float(minutes) / 1440.)) + 1.0) / 2.0
        return (self.max_humi - self.min_humi) * humi_percent + self.min_humi


class Thermostat(object):
    def __init__(self):
        self.temperature = 23.0
        self.desired_temperature = 23.3
        self.humidity = 60
        self.ac_on = False
        self.heat_on = False
        self.windows_open = False
        self.blinds_open = False
        self.away_mode = False
        self.cooling_rate = 0.2
        self.heating_rate = 0.2
        self.ambient_change_rate = 0.1
        self.temperature_range = .5

    def set_desired_temperature(self, desired_temperature):
        self.desired_temperature = round(float(desired_temperature), 2)

    def get_desired_temperature(self):
        return self.desired_temperature

    def check_temperature(self):
        if self.ac_on:
            print("Cooling the building")
            self.temperature -= self.cooling_rate
            if self.temperature < self.desired_temperature:
                print("Building is sufficiently cooled, turning off AC")
                self.ac_on = False
        elif self.heat_on:
            print("Heating the building")
            self.temperature += self.heating_rate
            if self.temperature > self.desired_temperature:
                print("Building is sufficiently heated, turning off heat")
                self.heat_on = False
        else:
            if self.temperature > self.desired_temperature + self.temperature_range:
                print("AC ON: Building too warm, cooling")
                self.ac_on = True
            elif self.temperature < self.desired_temperature - self.temperature_range:
                print("HEAT ON: Building too cold, heating")
                self.heat_on = True
        self.temperature = round(self.temperature, 2)

    def ambient_change_rate_factor(self, ambient_temperature):
        temperature_difference = abs(ambient_temperature - self.temperature)
        return temperature_difference * self.ambient_change_rate

    def ambient_humidity_adjust(self, ambient_humidity):
        if not self.ac_on and not self.heat_on:
            if ambient_humidity > self.humidity:
                self.humidity = round(self.humidity + self.ambient_change_rate, 2)
                print("Humidity changed to {}".format(self.humidity))
            if ambient_humidity < self.humidity:
                self.humidity = round(self.humidity - self.ambient_change_rate, 2)
                print("Humidity changed to {}".format(self.humidity))

    def ambient_temperature_adjust(self, ambient_temperature):
        if not self.ac_on and not self.heat_on:
            if ambient_temperature > self.temperature:
                self.temperature = round(self.temperature + self.ambient_change_rate, 2)
                print("Building naturally heated to {}".format(self.temperature))
            if ambient_temperature < self.temperature:
                self.temperature = round(self.temperature - self.ambient_change_rate, 2)
                print("Building naturally cooled to {}".format(self.temperature))


class Preferences(object):
    def __init__(self):
        self.city = "Minneapolis, MN"
        self.lat = 44.9778
        self.lon = 93.2650


class Simulator(object):
    def __init__(self, product_id, device_sn):
        self.murano = Murano(product_id, device_sn)

        cik = self.murano.load_cik()
        if not cik:
            cik = self.murano.activate()
            print('Activated device to obtain CIK')
        self.time_keeper = TimeKeeper()
        self.weather = Weather(self.murano.load_value('wuapi'))
        self.preferences = Preferences()
        self.thermostat = Thermostat()


    def start(self):
        print("Starting simulation.")
        self.weather.set_weather_data(
            self.preferences.lat,
            self.preferences.lon,
            self.time_keeper.now
        )
        self.run()

    def iterate(self):
        self.time_keeper.increment_time()
        self.run()

    def run(self):
        print(self.time_keeper.now)
        try:
            dt = round(float(self.murano.read(["desired_temperature"])['desired_temperature'][0]), 2)
            if dt != self.thermostat.get_desired_temperature():
                print("Thermostat changed from {} to {}".format(self.thermostat.get_desired_temperature(), dt))
                self.thermostat.set_desired_temperature(dt)
        except KeyError as e:
            print("Desired temperature not set")
            data = {
                'desired_temperature': '{}'.format(self.thermostat.get_desired_temperature())
            }
            self.murano.write(data)
        print("Ambient temp: {}".format(self.weather.ambient_temperature))
        print("Internal temp: {}".format(self.thermostat.temperature))
        print("Desired temp: {}".format(self.thermostat.desired_temperature))
        self.thermostat.check_temperature()
        self.thermostat.ambient_temperature_adjust(self.weather.ambient_temperature)
        self.thermostat.ambient_humidity_adjust(self.weather.ambient_humidity)
        data = {
            'temperature': '{}'.format(self.thermostat.temperature),
            'heat_on': '{}'.format(int(self.thermostat.heat_on)),
            'ac_on': '{}'.format(int(self.thermostat.ac_on)),
            'ambient_temperature': '{}'.format(self.weather.ambient_temperature),
            'humidity': '{}'.format(self.thermostat.humidity)
        }
        try:
            self.murano.write(data)
        except Exception as e:
            print(data)
            print(e)
            pass


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print('Usage:')
        print('   python ./hvac-simulator.py <product_id> <device_sn>')
        exit(1)

    PRODUCT_ID = sys.argv[1]
    DEVICE_SN = sys.argv[2]

    simulator = Simulator(PRODUCT_ID, DEVICE_SN)
    simulator.start()
    while True:
        simulator.iterate()
        time.sleep(1)
