$(function(){
	var muranoToken = null;

  function default_value(value, default_val) {
    return value !== 'null' ? value : default_val;
  }

	function render(thermostat) {
	    console.log(thermostat);
		var thermostatID = thermostat[0]['controllerID'];
		getThermostatState(thermostatID);
		$('#thermostat-desired-temperature').change(function() {
			setThermostatState(thermostatID, $(this).val());
		});
	}

    function updateTemperature(thermostatData) {
      console.log(thermostatData);
      temperature = default_value(thermostatData['results'][0]['series'][0]['values'][0][2], 0);
      console.log(temperature);
      $('#thermostat-desired-temperature').val(temperature);
		}

    function updateHeatCoolState(thermostatData) {
      /* Value order is alphabetic based on column name */
      
      var heat_on = default_value(thermostatData['results'][0]['series'][0]['values'][0][4], 0),
        ac_on = default_value(thermostatData['results'][0]['series'][0]['values'][0][1], 0);
      if (heat_on === 0) {
        $('#thermostat-heat-on').removeClass("led-red-blink");
        $('#thermostat-heat-on-text').text("Off");
      } else {
        $('#thermostat-heat-on').addClass("led-red-blink");
        $('#thermostat-heat-on-text').text("On");
      }
      if (ac_on === 0) {
        $('#thermostat-ac-on').removeClass("led-blue-blink");
        $('#thermostat-ac-on-text').text("Off");
      } else {
        $('#thermostat-ac-on').addClass("led-blue-blink");
        $('#thermostat-ac-on-text').text("On");
      }
    }

	/* Get all of the locks, using the authentication-free
     endpoint if no token is set, otherwise then authenticated
		 endpoint. */
	function getThermostat() {
		var params = {
			method: 'GET',
			url: window.location.href + 'device',
			success: function(data) {
				allThermostats = data;
				render(allThermostats);
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(xhr.responseText + ' (' + errorThrown + ')')
				alert(xhr.responseText)
			}
		};
		$.ajax(params);
	}

	function getThermostatState(sn) {
	    var params = {
			method: 'GET',
			url: window.location.href + 'device/' + sn,
			success: function(thermostatData) {
				updateTemperature(thermostatData);
				updateHeatCoolState(thermostatData);
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(xhr.responseText + ' (' + errorThrown + ')')
				alert(xhr.responseText)
			}
		};
		$.ajax(params);
	}
	/* send a command to the lock. 
     state may be 'locked' or 'unlocked' */
    function setThermostatState(sn, state) {
        $.ajax({
          method: 'POST',
          url: window.location.href + 'device/' + sn,
          data: '{"desired_temperature":"' + state + '"}',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function() {
                    console.log('Set the thermostat state');
          },
          error: function(xhr, textStatus, errorThrown) {
            alert(errorThrown);
          }
        });
    }
    getThermostat();
});
