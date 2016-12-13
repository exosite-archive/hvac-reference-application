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
	ac_on=request.body.ac_on,
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
		ac_on=request.body.ac_on,
	}
}
if tr.error ~= nil then
	ret.tsdb = tr
end

return ret
-- vim: set ai sw=2 ts=2 :
