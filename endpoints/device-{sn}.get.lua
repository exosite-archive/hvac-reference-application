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
		'temperature',
		'humidity',
		'ambient_temperature',
		'desired_temperature',
		'heat_on',
		'ac_on',
	},
	limit = 1,
	sampling_size = '5m',
}

local values = data.values[1]

return {
	controllerID = sn,
	temperature = (values[1] or 0),
	humidity = (values[2] or 0),
	ambient_temperature = (values[3] or 0),
	desired_temperature = (values[4] or 0),
	heat_on = (values[5] or 0),
	ac_on = (values[6] or 0),
}

-- vim: set ai sw=2 ts=2 :
