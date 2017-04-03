$(document).ready(function () {
  "use strict";
  var data_url = window.location.href + 'device', // url for getting data - should be raw tsdb response TODO make this a config value
    omit_keys = ['pid', 'time'], // list of keys to not plot
    TIMEOUT = 5, // timeout to refresh
    force_current_timestamp = false,
    units = {
      temperature: '&#8451;',
      humidity: '%',
      ambient_temperature: '&#8451;'
    },
    plot_indices = {},
    charts = [],
    c10 = d3.scale.category10(),
    timeout = TIMEOUT,
    countdown = false;

  function createChart(data, id) {
    if (!id) {
      id = 'chart';
    }

    var min_datapoint = _.minBy(_.map(data, function (series) {
      return _.minBy(series.values, 'y');
    }), 'y'),
      plot_min = Math.floor(min_datapoint.y - 1),

      max_datapoint = _.maxBy(_.map(data, function (series) {
        return _.maxBy(series.values, 'y');
      }), 'y'),
      plot_max = Math.ceil(max_datapoint.y + 1);

    nv.addGraph(function () {
      var chart = nv.models.lineChart()
        .margin({left: 100, right: 100})  //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
        .duration(350)  //how fast do you want the lines to transition?
        .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true)        //Show the y-axis
        .showXAxis(true)        //Show the x-axis
        .forceY([plot_min, plot_max]),
        min_timestamp;

      if (force_current_timestamp) {
        min_timestamp = _.minBy(_.map(data, function (series) {
          return _.minBy(series.values, 'x');
        }), 'x');

        chart.forceX([new Date(min_timestamp.x).valueOf(), new Date().valueOf()]);
      }

      chart.xAxis     //Chart x-axis settings
        .axisLabel('')
        .showMaxMin(false)
        .tickFormat(function (timestamp) {
          return d3.time.format('%m/%d %I:%M:%S%p')(new Date(timestamp));
        });

      chart.yAxis     //Chart y-axis settings
        .axisLabel('')
        .tickFormat(d3.format(''));

      d3.select('#'+id)    // Select the <svg> element you want to render the chart in.
        .datum(data)       // Populate the <svg> element with chart data...
        .call(chart);      // Finally, render the chart!

      //Update the chart when window resizes.
      nv.utils.windowResize(function () { chart.update(); });
      charts[id] = chart;
      return chart;
    });
    // tooltip gets messed up when data gets replaced
    d3.selectAll('.nvtooltip').remove();
    countdown = true;
  }

  function updateHeatDisplay(state) {
    if (state === 0) {
      $('#thermostat-heat-on').removeClass("led-red-blink");
      $('#thermostat-heat-on-text').text("Off");
    } else {
      $('#thermostat-heat-on').addClass("led-red-blink");
      $('#thermostat-heat-on-text').text("On");
    }
  }

  function updateAcDisplay(state) {
    if (state === 0) {
      $('#thermostat-ac-on').removeClass("led-blue-blink");
      $('#thermostat-ac-on-text').text("Off");
    } else {
      $('#thermostat-ac-on').addClass("led-blue-blink");
      $('#thermostat-ac-on-text').text("On");
    }
  }

  function makePlot(response) {
    if (response.results) {
      var plot = [],
        data = response.results[0].series;
      _.each(data, function (series) {
        var time_index;
        _.each(series.columns, function (column, column_index) {
          if (column === 'time') {
            time_index = column_index;
            return;
          }
          if (omit_keys.indexOf(column) === -1) {
            var graph = {
              key: column,
              values: [],
              color: c10(column)
            };
            plot.push(graph);
            plot_indices[column] = plot.length-1;
          }
        });

        _.each(series.values, function (row) {
          var timestamp = new Date(row[time_index]);
          _.each(row, function (value, value_index) {
            if (value_index === time_index) {
              return;
            }
            var key = series.columns[value_index],
              series_index = plot_indices[key];
            if (omit_keys.indexOf(key) === -1 && value !== null) {
              // add point to our series
              plot[series_index].values.push({
                x: timestamp,
                y: value
              });
            }
          });
        });
      });
      console.log("plots: ", plot);
      // if you want to display all data on a single plot, uncomment this line and comment the next ones out
      // the 2nd parameter is the ID of where to put the chart - must be a div in the html
      // createChart(plot, 'chart')
      _.each(plot, function (series) {
        if (series.values.length) {
          createChart([series], series.key);
          var value = _.first(series.values).y;
          console.log(value);
          if (series.key === 'heat_on') {
            updateHeatDisplay(value);
          } else if (series.key === 'ac_on') {
            updateAcDisplay(value);
          } else {
            value = Math.round(value*100)/100;
            value = value + units[series.key];
            console.log(value);
            $("#big-"+series.key).html(value);
          }
        }
      });


      // make sure data is sorted
      plot = _.sortBy(plot, (series) => {
        series.values = _.sortBy(series.values, 'x');
        return series;
      });

      /* var minimum_timestamp = _.min(_.map(plot, function (series) { */
      /*   return series.values[0]; */
      /* }), 'x'); */
    }
  }

  /* function updateStatus(response) { */
  /*   if (response.results) { */
  /*     console.log(response.results); */
  /*   } */
  /* } */

  function getData() {
    var dataRequest = new Request(data_url);

    fetch(dataRequest)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log("Got response");
        console.log(response);
        makePlot(response[0]);
        render(response);
      });
  }

  getData();

  function checkFetch() {
    timeout -= 1;
    if (countdown) {
      $("#refreshtime").text(timeout);
      if (force_current_timestamp) {
        _.each(charts, function (chart) {
          var min = chart.forceX()[0];
          chart.forceX([min, new Date().valueOf()]);
          if (typeof(chart.update) === "function") {
            chart.update();
          }
        });
      }
    }
    if (timeout === 0) {
      getData();
      $("#refreshtime").text('refreshing');
      timeout = TIMEOUT;
    }
  }

  setInterval(function () {
    checkFetch();
  }, 1000);


  /**
   * Thermostat related code
   */
  function default_value(value, default_val) {
    return typeof value !== 'undefined' && value !== 'null' ? value : default_val;
  }

  function render(thermostat) {
    console.log(thermostat);
    var thermostatID = thermostat[0].controllerID,
      desired_temperature = thermostat[0].desired_temperature;
    $('#device-sn').text(thermostatID);
    $('#thermostat-desired-temperature').val(desired_temperature);
    getThermostatState(thermostatID);
    $('#thermostat-desired-temperature').change(function () {
      setThermostatState(thermostatID, $(this).val());
    });
  }

  function updateTemperature(thermostatData) {
    console.log(thermostatData);
    /* Value order is alphabetic based on column name */
    var temperature = thermostatData.desired_temperature;
    console.log(temperature);
    $('#thermostat-desired-temperature').val(temperature);
  }

  function updateHeatCoolState(thermostatData) {
    /* Value order is alphabetic based on column name */
    var heat_on = default_value(thermostatData.results[0].series[0].values[0][4], 0),
      ac_on = default_value(thermostatData.results[0].series[0].values[0][1], 0);
    updateHeatDisplay(heat_on);
    updateAcDisplay(ac_on);
  }

  /* Get all of the thermostat historical data. */
  function getThermostat() {
    var params = {
      method: 'GET',
      url: window.location.href + 'device',
      success: function (allThermostats) {
        render(allThermostats);
      },
      error: function (xhr, textStatus, errorThrown) {
        alert(xhr.responseText + ' (' + errorThrown + ')');
        alert(xhr.responseText);
      }
    };
    $.ajax(params);
  }

  function getThermostatState(sn) {
    var params = {
      method: 'GET',
      url: window.location.href + 'device/' + sn,
      success: function (thermostatData) {
        updateTemperature(thermostatData);
        updateHeatCoolState(thermostatData);
      },
      error: function (xhr, textStatus, errorThrown) {
        alert(xhr.responseText + ' (' + errorThrown + ')');
        alert(xhr.responseText);
      }
    };
    $.ajax(params);
  }
  /* Set the desired temperature for a device. */
  function setThermostatState(sn, state) {
    $.ajax({
      method: 'POST',
      url: window.location.href + 'device/' + sn,
      data: '{"desired_temperature":"' + state + '"}',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function () {
        console.log('Set the thermostat state');
      },
      error: function (xhr, textStatus, errorThrown) {
        alert(errorThrown);
      }
    });
  }
  getThermostat();

});
//  vim: set sw=2 ts=2 :
