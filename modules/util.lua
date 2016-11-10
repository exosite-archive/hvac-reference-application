util = {}
-- get all the states for this device from the hash
util.getStates = function(parm_name, parm_value)
	-- http://redis.io/commands/hgetall
	return Keystore.command({
		command = 'hgetall',
		key = 'state:' .. parm_name .. ':' .. parm_value
	}).value
end

-- set one or more states for a given lock or dwelling
-- parm_name is 'lockID' or 'dwellingID', parm_value is the ID
-- states is a table like {field1, value1, field2, value2, ...}
util.setStates = function(parm_name, parm_value, states)
	-- http://redis.io/commands/hmset
  return Keystore.command({
		command = 'hmset',
		key = 'state:' .. parm_name .. ':' .. parm_value,
		args = states
	})
end

-- remove all state specific lock or dwelling
-- parm_name is 'lockID' or 'dwellingID', parm_value is the ID
util.deleteState = function(parm_name, parm_value)
	return Keystore.delete({
		key = 'state:' .. parm_name .. ':' .. parm_value
	})
end
