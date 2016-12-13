$(function(){
	var muranoToken = null;
	var thermostatID = [];

	/* render the locks on the screen */
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
      temperature = thermostatData['ambient_temperature'];
      console.log(temperature);
      $('#thermostat-desired-temperature').val(temperature);
		}

    function updateHeatCoolState(thermostatData) {
      var heat_on = thermostatData['heat_on'],
        ac_on = thermostatData['ac_on'];
      if (heat_on !== 0) {
        $('#thermostat-heat-on').addClass("led-red-blink");
        $('#thermostat-heat-on-text').text("On");
      } else {
        $('#thermostat-heat-on').removeClass("led-red-blink");
        $('#thermostat-heat-on-text').text("Off");
      }
      if (ac_on !== 0) {
        $('#thermostat-ac-on').addClass("led-blue-blink");
        $('#thermostat-ac-on-text').text("On");
      } else {
        $('#thermostat-ac-on').removeClass("led-blue-blink");
        $('#thermostat-ac-on-text').text("Off");
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
			success: function(data) {
				thermostatData = data;
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
