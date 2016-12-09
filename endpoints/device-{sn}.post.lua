--#ENDPOINT post /device/{sn}
-- luacheck: globals request response (magic variables from Murano)
local sn = tostring(request.parameters.sn)
if sn == nil then
	response.code = 400
	response.message = "controllerID missing"
	return
end
local pid = Config.solution().products[1]

local r = Device.write({
	pid=pid,
	device_sn=sn,
	desired_temperature=request.body.desired_temperature,
	heat_on=request.body.heat_on,
	ac_on=request.body.ac_on,
})

return r
-- vim: set ai sw=2 ts=2 :
