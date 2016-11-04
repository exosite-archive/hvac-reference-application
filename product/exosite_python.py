# Handles communications with Murano
#
# Usage: instantiate with a product and device id, then call activate()
#
import requests
import email.utils as eut
import datetime
import shelve

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
        self.CONFIG = 'config.db'
        self.cik = None
        self.product_id = product_id
        self.device_id = device_id
        self.product_url = 'https://' + product_id + '.m2.exosite.com'
        self.filename = 'product-{0}-device-{1}.secret'.format(
            self.product_id,
            self.device_id
        )

    def save_cik(self, cik):
        self.cik = cik
        print('saving CIK to ' + self.filename)
        with shelve.open(self.CONFIG) as db:
            db['cik'] = cik.strip()

    def load_cik(self):
        with shelve.open(self.CONFIG) as db:
            try:
                self.cik = db['cik']
            except Exception as e:
                raise
            return self.cik

    def timestamp():
        '''Get the current timestamp for the Murano product API'''
        r = requests.get('https://m2.exosite.com/timestamp')
        r.raise_for_status()
        return int(r.text)

    def activate(self):
        try:
            self.cik = self.load_cik()
        except Exception as e:
            # activate device
            r = requests.post(
                self.product_url + '/provision/activate',
                headers={'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
                data='vendor={0}&model={0}&sn={1}'.format(self.product_id, self.device_id)
            )
            r.raise_for_status()

            self.save_cik(r.text)

    def write(self, writes):
        '''write Murano device resource.
        http://docs.exosite.com/murano/products/device_api/http/#write'''

        assert (len(writes) > 0)
        r = requests.post(
            self.product_url + '/onep:v1/stack/alias',
            headers={
                'X-Exosite-CIK': self.cik,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            # requests takes care of turning "writes" dict into
            # form-urlencoded format, like this:
            # alias1=value1&alias2=value2
            data=writes)
        r.raise_for_status()

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

        r = requests.get(
            self.product_url + '/onep:v1/stack/alias?' + '&'.join(aliases),
            headers=headers
        )

        r.raise_for_status()
        # convert urlencoded string (a=1&b=2) into a Python
        # dictionary ({'a':1,'b':2})
        return parse_qs(r.text)

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

        r = requests.get(
            self.product_url + '/onep:v1/stack/alias?' + '&'.join(aliases),
            headers=headers
        )

        # update timestamp
        if 'last-modified' in r.headers:
            # 1 + to start the next reading from the following
            # timestamp
            if_modified_since = 1 + int(datetime_to_epoch(
                datetime.datetime(*eut.parsedate(r.headers['last-modified'])[:6])))

        r.raise_for_status()
        if '=' in r.text:
            # new value
            value = r.text.split('=')[1]
            return value, if_modified_since
        else:
            # long poll timed out
            return None, if_modified_since
