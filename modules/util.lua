util = {}
---
-- Parse the Tsdb output and return as Timeseries compatible
-- { sn=<device_serial>, data=<data_table> }
-- \returns table
util.parse_results = function(opts)
	-- Results are returned in alphabetic order by column
	local result = setmetatable({}, {['__type']='slice'})
	local series = setmetatable({}, {['__type']='slice'})
	local entry = {}
	entry.tags = {sn=opts.sn}
	entry.columns = opts.data.columns
	local values = {} 
	if opts.data.values ~= nil then
		values = opts.data.values
	end
	values = setmetatable(values, {['__type']='slice'})
	entry.values = values
	table.insert(series, entry)
	table.insert(result, {series=series})
	return {results=result, controllerID=opts.sn}
end

-- vim: set ai sw=2 ts=2 :
