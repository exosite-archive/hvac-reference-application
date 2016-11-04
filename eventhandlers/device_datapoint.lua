--#EVENT device datapoint
--[[

  - EVENT TRIGGER -

  File in the eventhandlers folders are call at service event trigger. The file name needs to match 'servicealias'_'eventtype'.lua

  In this example this script is triggered by the 'datapoint' event from the Device service. This event provides a 'data' parameters (http://docs.exosite.com/murano/services/device/#datapoint).

  All available Eventhandlers and parameters are documented under the events sections of the Murano service documentation (http://docs.exosite.com/murano/services).

]]--

-- Your code here
print(data.value)

--[[

  - CALL A SERVICE -

  Murano offers many services to customize your script behavior.
  For instance the Keystore service let you save and retrieve value across your solution.

  The parameters detailed definition can be found in the Murano service documentation (http://docs.exosite.com/murano/services).
--]]

-- Example: To save the device message value in the key-store
-- Keystore.set({key="latest", value=data.value})