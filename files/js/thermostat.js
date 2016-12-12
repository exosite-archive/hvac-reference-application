$(function(){
	var muranoToken = null;
	var thermostatID = [];

	/* render the locks on the screen */
	function render(thermostat) {
	    console.log(thermostat);
		thermostatID = thermostat[0]['controllerID'];
		getThermostatState(thermostatID);
		$('#thermostat-desired-temperature').change(function() {
			setThermostatState(thermostatID, $(this).val());
		});
	}

    function updateTemperature(thermostatData) {
        console.log(thermostatData);
        temperature = thermostatData['desired_temperature'];
        console.log(temperature);
		$('#thermostat-desired-temperature').val(temperature);
		}

	/* Get all of the locks, using the authentication-free
     endpoint if no token is set, otherwise then authenticated
		 endpoint. */
	function getThermostat() {
		var params = {
			method: 'GET',
			url: '/device',
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
			url: '/device/' + sn,
			success: function(data) {
				thermostatData = data;
				updateTemperature(thermostatData);
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
          url: '/device/' + sn,
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
