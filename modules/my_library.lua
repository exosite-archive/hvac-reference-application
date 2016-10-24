
--[[

  - MODULARIZE YOUR CODE -

  Define here functions reusable in event scripts. More than one function can be added to a library file
--]]

-- A good practice is to wrap your modules in a table
-- myModule = {}

-- add a function to your module
-- function myModule.saveData(devicemessage)
  --[[

    - CALL A SERVICE -

    Murano offers many services to customize your script behavior.
    For instance the Keystore service let you save and retrieve value across your solution.

    The parameters detailed definition can be found in the Murano service documentation (http://docs.exosite.com/murano/services).
  --]]

  -- Example save the parameter value in the key-store
  -- Keystore.set({key="latest", value=devicemessage})

-- end
