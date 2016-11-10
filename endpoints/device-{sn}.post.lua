--#ENDPOINT post /device/{sn}
local pid = Config.solution().products[1]

local r = Device.write({
  pid=pid,
  device_sn=request.parameters.sn,
  ['desired_temperature']=request.body['desired_temperature']
})

return r