#!/bin/python
import os

import configparser
import datetime
import math
import time

import requests

config = configparser.ConfigParser()
cik = '095820daba8369af263b8a7db5025eca8c8ea3b1'

class TimeKeeper(object):
    def __init__(self):
        self.now = datetime.datetime(2015, 1, 1)

    def increment_time(self):
        self.now = self.now + datetime.timedelta(minutes=15)


class Weather(object):
    def __init__(self):
        self.min_temp = 15
        self.max_temp = 10
        self.ambient_temperature = 0
        self.precipitation = False
        self.sunny = False
        self.season = None
        self.wu_api_key = 'b7a5dbd4c93660dd'
        self.current_date = datetime.datetime(2014, 1, 1)

    def set_weather_data(self, lat, lon, current_datetime):
        if self.current_date.year != current_datetime.year or self.current_date.month != current_datetime.month or self.current_date.day != current_datetime.day:
            self.current_date = datetime.datetime(current_datetime.year, current_datetime.month, current_datetime.day, 0, 0, 0)
            try:
                wr = requests.get('http://api.wunderground.com/api/{}/history_20060405/q/CA/San_Francisco.json'.format(self.wu_api_key))
                # if wr.json()['history']['dailysummary'][0]['rain'] == 1 or wr.json()['history']['dailysummary'][0]['snow'] == 1:
                #     self.precipitation = True
                # else:
                #     self.precipitation = False

                self.min_temp = float(wr.json()['history']['dailysummary'][0]['mintempm'])
                self.max_temp = float(wr.json()['history']['dailysummary'][0]['maxtempm'])
            except Exception as e:
                pass

        minutes = (current_datetime - self.current_date).seconds/60.0
        self.ambient_temperature = round(self.getTemp(minutes), 2)

    def getTemp(self, minutes):
        temp_percent = (-1.0 * math.sin(2.0 * math.pi * (float(minutes) / 1440.)) + 1.0) / 2.0
        return (self.max_temp - self.min_temp) * temp_percent + self.min_temp


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
        self.ambient_change_rate = 0.05
        self.temperature_range = .5
        self.set_desired_temp(self.desired_temperature)

    def set_desired_temp(self, desired_temperature):
        headers = {'X-Exosite-CIK': cik}
        data = {
            'desired_temperature':'{}'.format(desired_temperature)
        }
        req = requests.post('https://m2.exosite.com/onep:v1/stack/alias?state', data=data, headers=headers)

    def pull_desired_temperature(self):
        # Return data from platform
        headers = {'X-Exosite-CIK': cik, 'Accept': 'application/x-www-form-urlencoded; charset=utf-8'}
        req = requests.get('https://m2.exosite.com/onep:v1/stack/alias?desired_temperature', headers=headers)

    def check_temperature(self):
        self.pull_desired_temperature()
        if self.ac_on:
            print("Cooling the buidling")
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


if __name__=="__main__":
    from pprint import pprint
    time_keeper = TimeKeeper()
    weather = Weather()
    preferences = Preferences()
    thermostat = Thermostat()

    def set_state(device_cik, temperature, heat_on, ac_on, ambient_temperature):
        headers = {'X-Exosite-CIK': device_cik}
        data = {
            'temperature':'{}'.format(temperature),
            'heat_on':'{}'.format(int(heat_on)),
            'ac_on':'{}'.format(int(ac_on)),
            'ambient_temperature':'{}'.format(ambient_temperature),
            # TODO: Calculate the internal humidity based on external humidity???
            'humidity':'{}'.format(85)
        }
        req = requests.post('https://m2.exosite.com/onep:v1/stack/alias?state', data=data, headers=headers)

    while True:
        print(time_keeper.now)
        weather.set_weather_data(preferences.lat, preferences.lon, time_keeper.now)
        print("ambient temp: {}".format(weather.ambient_temperature))
        print("internal temp: {}".format(thermostat.temperature))
        print("desired temp: {}".format(thermostat.desired_temperature))
        thermostat.check_temperature()
        thermostat.ambient_temperature_adjust(weather.ambient_temperature)
        set_state(cik, thermostat.temperature, thermostat.heat_on, thermostat.ac_on, weather.ambient_temperature)
        time_keeper.increment_time()
        time.sleep(1)