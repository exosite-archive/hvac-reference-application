--#EVENT device datapoint
-- luacheck: globals data (magic variable from Murano)

-- Get the timestamp for this data if a record action.
-- Otherwise use default (now)
local stamped = nil
if data.api == "record" then
  stamped = tostring(data.value[1]) .. 's'
end

-- If the alias is for GWE, store those in some Keystore lists
-- Instead append them to the KV logs.
if table.contains(GWE.Fields, data.alias) then
  local key = string.gsub(data.alias .. "." .. data.device_sn, '[^%w@.-]', '-')
  Keystore.command{
    key = key,
    command = 'lpush',
    args = { data.value[2] }
  }
  Keystore.command{
    key = key,
    command = 'ltrim',
    args = { 0, 20 }
  }

else
  -- One of the HVAC resoruces; it goes in TSDB.
  Tsdb.write{
    tags = {sn=data.device_sn},
    metrics = {[data.alias] = tonumber(data.value[2])},
    ts = stamped
  }
end

-- vim: set et ai sw=2 ts=2 :
