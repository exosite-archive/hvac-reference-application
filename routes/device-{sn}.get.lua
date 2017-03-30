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
	fill = 0,
	sampling_size = '5m',
}

if request.parameters.raw ~= nil then return data end

local tsd = util.parse_results{sn=sn, data=data}
if request.parameters.rawd ~= nil then return tsd end
local clm_idx = table.find(data.columns, 'desired_temperature')
if clm_idx > 0 and #data.values > 0 then
	tsd.desired_temperature = data.values[1][clm_idx]
end
--[======[
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
--]======]
return tsd

-- vim: set ai sw=2 ts=2 :
