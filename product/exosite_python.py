# Handles communications with Murano
#
# Usage: instantiate with a product and device id, then call activate()
#
import os
import datetime
import email.utils as eut
import requests

from configparser import ConfigParser, NoSectionError

try:
    # Python 3
    from urllib.parse import parse_qs
except:
    # Python 2
    from urlparse import parse_qs


def datetime_to_epoch(dt):
    '''Get the current epoch in seconds from a datetime object'''
    return (dt - datetime.datetime(1970, 1, 1)).total_seconds()


class Murano(object):
    def __init__(self, product_id=None, device_id=None):
        self.CONFIG = 'config.ini'
        self.config = ConfigParser()
        self.cik = None
        self.product_id = product_id
        self.device_id = device_id
        self.product_url = 'https://' + product_id + '.m2.exosite.com'

    def create_config(self, filename):
        self.config['main'] = {
            'cik': ''
        }
        with open(filename, 'w') as f:
            self.config.write(f)

    def save_value(self, option, value):
        self.config.read(self.CONFIG)
        try:
            self.config.set('main', option, value)
        except NoSectionError as e:
            self.config.add_section('main')
            self.config.set('main', option, value)
        with open(self.CONFIG, 'w') as f:
            self.config.write(f)

    def load_value(self, option):
        self.config.read(self.CONFIG)
        try:
            value = self.config['main'].get(option, None)
            print("Returning value {} from option {}".format(value, option))
        except KeyError as e:
            print("Main config doesn't exist, creating")
            self.create_config(self.CONFIG)
            value = self.config['main'].get('option', None)
        return value

    def save_cik(self, cik):
        self.cik = cik.strip()
        self.config.read(self.CONFIG)
        print('saving CIK to ' + self.CONFIG)
        try:
            self.config.set('main', 'cik', self.cik)
        except NoSectionError as e:
            self.config.add_section('main')
            self.config.set('main', 'cik', self.cik)
        with open(self.CONFIG, 'w') as f:
            self.config.write(f)

    def load_cik(self):
        if not os.path.exists(self.CONFIG):
            self.create_config(self.CONFIG)
        else:
            self.config.read(self.CONFIG)
            try:
                self.cik = self.config['main'].get('cik', None)
            except KeyError as e:
                self.create_config(self.CONFIG)
        return self.cik

    def timestamp(self):
        '''Get the current timestamp for the Murano product API'''
        req = requests.get('https://m2.exosite.com/timestamp')
        req.raise_for_status()
        return int(req.text)

    def activate(self):
        req = requests.post(
            self.product_url + '/provision/activate',
            headers={'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
            data='vendor={0}&model={0}&sn={1}'.format(self.product_id, self.device_id)
        )
        req.raise_for_status()
        self.save_cik(req.text)

    def write(self, writes):
        '''write Murano device resource.
        http://docs.exosite.com/murano/products/device_api/http/#write'''

        assert (len(writes) > 0)
        req = requests.post(
            self.product_url + '/onep:v1/stack/alias',
            headers={
                'X-Exosite-CIK': self.cik,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            # requests takes care of turning "writes" dict into
            # form-urlencoded format, like this:
            # alias1=value1&alias2=value2
            data=writes)
        req.raise_for_status()

    def read(self, aliases):
        '''read Murano device resources, returning a dict mapping
        aliases to values, or to None if the alias resource has never
        been written to.
        http://docs.exosite.com/murano/products/device_api/http/#read'''
        assert (len(aliases) > 0)
        headers = {
            'X-Exosite-CIK': self.cik,
            'Accept': 'application/x-www-form-urlencoded; charset=utf-8'
        }

        req = requests.get(
            self.product_url + '/onep:v1/stack/alias?' + '&'.join(aliases),
            headers=headers
        )

        req.raise_for_status()
        # convert urlencoded string (a=1&b=2) into a Python
        # dictionary ({'a':1,'b':2})
        return parse_qs(req.text)

    def read_longpoll(self, aliases, timeout_millis=None, if_modified_since=None):
        '''read Murano device resources, waiting for an update
        http://docs.exosite.com/murano/products/device_api/http/#long-polling'''
        assert (len(aliases) > 0)
        headers = {
            'X-Exosite-CIK': self.cik,
            'Accept': 'application/x-www-form-urlencoded; charset=utf-8',
            'Request-Timeout': timeout_millis
        }
        if if_modified_since is not None:
            headers['If-Modified-Since'] = if_modified_since

        req = requests.get(
            self.product_url + '/onep:v1/stack/alias?' + '&'.join(aliases),
            headers=headers
        )

        # update timestamp
        if 'last-modified' in req.headers:
            # 1 + to start the next reading from the following
            # timestamp
            if_modified_since = 1 + int(datetime_to_epoch(
                datetime.datetime(*eut.parsedate(req.headers['last-modified'])[:6])))

        req.raise_for_status()
        if '=' in req.text:
            # new value
            value = req.text.split('=')[1]
            return value, if_modified_since
        else:
            # long poll timed out
            return None, if_modified_since
