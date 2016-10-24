--#EVENT device datapoint
--[[

  - EVENT TRIGGER -

  File in the eventhandlers folders are call at service event trigger. The file name needs to match 'servicealias'_'eventtype'.lua

  In this example this script is triggered by the 'datapoint' event from the Device service. This event provides a 'data' parameters (http://docs.exosite.com/murano/services/device/#datapoint).

  All available Eventhandlers and parameters are documented under the events sections of the Murano service documentation (http://docs.exosite.com/murano/services).

]]--

-- Your code here
local payload = {
  event_timestamp=math.floor(data.timestamp/1000000),
  onep_timestamp=data.value[2],
  lua_timestamp=os.time()
}


function table_to_idb(tbl)
	if tbl == nil then
		return ""
	end
	local building = {}
	for k,v in pairs(tbl) do
	  if type(v) == "number" then
  		building[#building + 1] = tostring(k) .."=" .. string.format("%.f", v)
		else
  		building[#building + 1] = tostring(k) .."=" .. tostring(v)
		end
	end
	return table.concat(building, ",")
end

---
-- Build a InfluxDB write command from lua tables.
function ts_write(metric, tags, fields, timestamp)
	local s = tostring(metric)
	s = s .. ","
	s = s .. table_to_idb(tags)
	s = s .. " "
	s = s .. table_to_idb(fields)
	if timestamp ~= nil then
		s = s .. " " .. timestamp
	end
	return s
end

local query = tostring(ts_write("timestamps", {sn=data.device_sn}, payload))

Timeseries.write({query=query})
