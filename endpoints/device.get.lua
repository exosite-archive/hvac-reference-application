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
			'temperature',
			'humidity',
			'ambient_temperature',
			'desired_temperature',
			'heat_on',
			'ac_on',
		},
    fill = 0,
		limit = 1,
		sampling_size = '5m',
	}

	local values = data.values[1]
	table.insert(response, {
		controllerID = device.sn,
			temperature = (values[1] or 0),
			humidity = (values[2] or 0),
			ambient_temperature = (values[3] or 0),
			desired_temperature = (values[4] or 0),
			heat_on = (values[5] or 0),
			ac_on = (values[6] or 0),
	})
end
return response

-- vim: set ai sw=2 ts=2 :
