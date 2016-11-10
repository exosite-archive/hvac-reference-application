--#ENDPOINT get /device/{sn}
--#ENDPOINT post /device/{sn}
local pid = Config.solution().products[1]

local r = Device.list({
  pid=pid,
  device_sn=request.parameters.sn
})

return r