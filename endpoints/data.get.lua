--#ENDPOINT get /data
-- luacheck: globals request response (magic variables from Murano)

-- response.message = Timeseries.query({q='select * from "data" WHERE timestamp >
--  now() - 1d group by sn order by desc limit 1000'})

local got = Tsdb.query{
	metrics = {
		'temperature',
		'humidity',
		'ambient_temperature',
		'desired_temperature',
		'heat_on',
		'ac_on',
	},
	limit = 1000,
	relative_start = '-1d',
	--sampling_size = '1m',
	epoch = 's',
}

return got

-- vim: set ai sw=2 ts=2 :
