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
local response = setmetatable({}, {['__type']='slice'})
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
	local clm_idx = table.find(data.columns, 'desired_temperature')
	if clm_idx > 0 and #data.values > 0 then
		tsd.desired_temperature = data.values[1][clm_idx]
	end
	table.insert(response, tsd)
end
return response

-- vim: set ai sw=2 ts=2 :
