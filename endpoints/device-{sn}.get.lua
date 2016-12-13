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

return _G.util.parse_results{sn=sn, data=data}

-- vim: set ai sw=2 ts=2 :
