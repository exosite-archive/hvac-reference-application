-- luacheck: ignore 122/table (This is all about modifying the table)

---
-- Dump a table as a string; recursively
-- \returns string
function table.dump(o)
	if type(o) == 'table' then
		local s = '{ '
		for k,v in pairs(o) do
			if type(k) ~= 'number' then k = '"'..k..'"' end
			s = s .. '['..k..'] = ' .. table.dump(v) .. ','
		end
		return s .. '} '
	else
		return tostring(o)
	end
end

---
-- Does table have item?
function table.contains(table, element)
	for _, value in pairs(table) do
		if value == element then
			return true
		end
	end
	return false
end


---
-- Find a table in a list of tables.
-- \returns idx, table found; nil if not found
function table.find(tbl, key, value)
	if type(key) == 'nil' then return nil, nil end
	for i,v in ipairs(tbl) do
		if type(v) == 'table' then
			if v[key] == value then
				return i, v
			end
		end
	end
	return nil, nil
end

---
-- Replace a table
function table.replacingAdd(tbl, key, newitem)
	local idx, _ = table.find(tbl, key, newitem[key])
	if idx == nil then
		table.insert(tbl, newitem)
	else
		table.remove(tbl, idx)
		table.insert(tbl, idx, newitem)
	end
end

-- vim: set ai sw=2 ts=2 :
