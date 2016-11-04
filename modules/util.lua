util = {}

-- get current logged in user from webservice request
-- returns user table, or nil if no user token is contained
-- in cookie or token headers. Returned user table looks 
-- like this:
-- {
--   "creation_date":1.477266383e+09,
--   "email":"frank@exosite.com",
--   "id":2,
--   "name":"frank",
-- 	 "status":1,
--   "token":"eyJ0e..."
-- }
util.currentUser = function (request)
  return util.currentUserFromHeaders(request.headers)
end

-- determine the current user from the session information
-- stored in webservice or websocket request headers.
-- returns user table or nil if no user is contained
-- in headers
util.currentUserFromHeaders = function (headers)
	local token = nil
	if type(headers.token) == "string" then
		-- the caller passed a token header. Use that.
		token = headers.token
	else
		-- check for the token in the session in a cookie
		if type(headers.cookie) == "string" then
			local _, _, token = string.find(headers.cookie, "sid=([^;]+)")
			if type(token) ~= "string" then
				return nil
			end
		else 
			return nil
		end
  end
  local user = User.getCurrentUser({token = token})
  if user ~= nil and user.id ~= nil then
    user.token = token
    return user
  end
  return nil
end

-- get all the states for this device from the hash
-- parm_name is 'lockID' or 'dwellingID', parm_value is the ID
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

-- return a list of items of a particular parameter_name
-- accessible to all of the user's roles. Returns a table like
util.getUserAccessibleItems = function(user_id, parameter_name)
	local roles = User.listUserRoles({id = user_id})
	local items = {}

	function addItemsFromParameters(role)
		for k, parameter in pairs(role.parameters) do
			if parameter_name == nil or parameter.name == parameter_name then
				local state = util.getStates(parameter.name, parameter.value)
				local item = {
					role_id = role.role_id,
					[parameter.name] = parameter.value,
					state = state
				}	
				table.insert(items, item)
		  end	
		end
	end

	for k, role in pairs(roles) do
		addItemsFromParameters(role)
	end

	return items
end 