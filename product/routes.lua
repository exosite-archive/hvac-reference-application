--#ENDPOINT get /data
-- luacheck: globals request response (magic variables from Murano)

-- response.message = Timeseries.query({q='select * from "data" WHERE timestamp >
--  now() - 1d group by sn order by desc limit 1000'})

local got = Tsdb.query{
	metrics = {
		'temperature',
		'humidity',
		--'ambient_temperature',
		--'desired_temperature',
		--'heat_on',
		--'ac_on',
	},
	limit = 1000,
	relative_start = '-1d',
	sampling_size = '1m',
	epoch = 's',
	fill = 'null',
}

return got

-- vim: set ai sw=2 ts=2 :


--#ENDPOINT get /device/{sn}
-- luacheck: globals request response (magic variables from Murano)
local sn = tostring(request.parameters.sn)
if sn == nil then
	response.code = 400
	response.message = "controllerID missing"
	return
end

local data = Tsdb.query{
	tags={sn=sn},
	metrics = {
		'ac_on',
		'ambient_temperature',
		'desired_temperature',
		'heat_on',
		'humidity',
		'temperature'
	},
  fill = "null",
	sampling_size = '5m',
}

local tsd = util.parse_results{sn=sn, data=data}
local dtemp = Tsdb.query{
    tags={sn=sn},
    metrics = {
        'desired_temperature'
    },
    limit = 1
}
if dtemp.values ~= nil then
  tsd.desired_temperature = dtemp.values[1][2]
end
return tsd

-- vim: set ai sw=2 ts=2 :


--#ENDPOINT post /device/{sn}
-- luacheck: globals request response (magic variables from Murano)
local sn = tostring(request.parameters.sn)
if sn == nil then
	response.code = 400
	response.message = "controllerID missing"
	return
end
local pid = Config.solution().products[1]

local ret = {}

local dr = Device.write{
	pid=pid,
	device_sn=sn,
	desired_temperature=request.body.desired_temperature,
	heat_on=request.body.heat_on,
	ac_on=request.body.ac_on
}
ret.device = dr
-- Do this as two seperate write to make sure data is ready to read before change
-- is marked.
ret.change = Device.write{
	pid=pid,
	device_sn=sn,
	change = 1
}

local tr = Tsdb.write{
	tags = {sn=sn},
	metrics = {
		desired_temperature=request.body.desired_temperature,
		heat_on=request.body.heat_on,
		ac_on=request.body.ac_on
	}
}
if tr.error ~= nil then
	ret.tsdb = tr
end

return ret
-- vim: set ai sw=2 ts=2 :


--#ENDPOINT get /device
-- ?offset=#
-- luacheck: globals request response (magic variables from Murano)
local solutionConfig = Config.solution()
if #solutionConfig.products == 0 then
	response.code = 500
	response.message = 'Uh oh. No product has been associated with this solution.'
	return
end
local pid = solutionConfig.products[1]
local offset = tonumber(request.parameters.offset)

-- get the list of devices for this product
local devices = Device.list{pid=pid, offset=offset}
local response = {}
for _, device in pairs(devices) do

	-- Get the most recent data in the last 5m window.
	local data = Tsdb.query{
		tags={sn=device.sn},
		metrics = {
			'ac_on',
			'ambient_temperature',
			'desired_temperature',
			'heat_on',
			'humidity',
			'temperature'
		},
    fill = "null",
    limit = 5,
		sampling_size = '5m'
	}

  -- Merge last desired temperature
  local tsd = util.parse_results{sn=device.sn, data=data}
  local dtemp = Tsdb.query{
      tags={sn=sn},
      metrics = {
          'desired_temperature'
      },
      limit = 1
  }
  if dtemp.values ~= nil then
    tsd.desired_temperature = dtemp.values[1][2]
  end
	table.insert(response, tsd)
end
return response

-- vim: set ai sw=2 ts=2 :


