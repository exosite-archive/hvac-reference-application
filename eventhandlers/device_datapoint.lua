--#EVENT device datapoint

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

if data.alias == "temperature" or data.alias == "humidity" then
	local fields = {
		[alias]=data.value[2]
    }

	local tags = {
		sn=data.device_sn,
		pid=data.pid
	}

	local query = tostring(ts_write("data", tags, fields))

	Timeseries.write({query=query})
end
