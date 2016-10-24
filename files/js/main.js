var missing_chart;
var delay_chart;
var first_point = {};


function getData() {
  let order = ['10', '5', '1'];
  let colors = ['#1f77b4', '#ff7f0e', '#d62728'];
  var maxes = {};
  var avgs = {};

  var dataRequest = new Request('https://time-delay-test.apps.exosite.io/data');

  fetch(dataRequest)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.results) {
        all_data = response.results[0].series
        delay_data = _.map(all_data, function(series) {
          sn = series.tags.sn;
          columns = series.columns;
          onep_column = 0;
          lua_column = 0;
          _.each(columns, function(column, index) {
            if(column == "onep_timestamp") {
              onep_column = index;
            } else if(column == "lua_timestamp") {
              lua_column = index;
            }
          })
          values = _.map(series.values, function(value) {
            tsdb_timestamp = new Date(value[0])
            lua_timestamp = value[lua_column]
            onep_timestamp = value[onep_column]
            return {x: tsdb_timestamp, y: (lua_timestamp - onep_timestamp)};
          })
          maxes[sn] = _.maxBy(values, 'y');
          avgs[sn] = _.mean(values, 'y');
          $("#max_"+sn).text(maxes[sn].y);
          $("mean_"+sn).text(avgs[sn].y);
          return {
            key: sn+'s rate',
            values: _.sortBy(values, 'x'),
            color: colors[order.indexOf(sn)]
          }
        })
        delay_data = _.sortBy(delay_data, (data) => {
          return order.indexOf(data.key);
        })

        missing_data = _.map(all_data, function(series) {
          sn = series.tags.sn;
          if(sn == 10) {
            console.log("Data: ", series)
          }
          columns = series.columns;
          console.log("columns: ", columns)
          onep_column = 0
          series.values.reverse()
          _.each(columns, function(column, index) {
            if(column == "onep_timestamp") {
              onep_column = index;
            }
          })
          onep_timestamps = _.map(series.values, function(value) {
            return (new Date(value[0]).valueOf())/1000
          })
          deltas = _.filter(_.map(onep_timestamps, function(value, i) {
            if(i > 0) {
              // delta = (new Date(value[0]).valueOf())/1000 - (new Date(series.values[i-1][0]).valueOf())/1000
              delta = value - onep_timestamps[i-1];
              return delta;
            }
            return undefined;
          }))
          values = _.filter(_.map(deltas, function(delta, i) {
            if(delta > (sn+1)) {
              return {x: new Date(series.values[i][0]), y: parseInt(delta/sn)}
            } else {
              if(typeof series.values[i] !== "undefined") {
                return {x: new Date(series.values[i][0]), y: 0}
              }
            }
          }))
          return {
            key: sn+' missing points',
            values: _.sortBy(values, 'x'),
            color: colors[order.indexOf(sn)]
          }
        })

        missing_data = _.sortBy(missing_data, (data) => {
          return order.indexOf(data.key);
        })

        first_point = _.min(_.map(delay_data, function(series) {
            return series.values[0]
        }), 'y')

        maximum_delay = _.max(_.map(maxes, function(value) { return value.y; }))

        nv.addGraph(function() {
          missing_chart = nv.models.lineChart()
                        .margin({left: 100, right: 100})  //Adjust chart margins to give the x-axis some breathing room.
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        // .transitionDuration(350)  //how fast do you want the lines to transition?
                        .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(true)        //Show the y-axis
                        .showXAxis(true)        //Show the x-axis
                        .forceY([0,2])
                        .forceX([new Date(first_point.x).valueOf(), new Date().valueOf()])
          ;

          missing_chart.xAxis     //Chart x-axis settings
              .axisLabel('')
              .tickFormat(function(timestamp) {
                return d3.time.format('%I:%M:%S%p')(new Date(timestamp))
              });

          missing_chart.yAxis     //Chart y-axis settings
              .axisLabel('Humidity (%)')
              .tickFormat(d3.format(''));

          d3.select('#missing_plot')    //Select the <svg> element you want to render the chart in.
              .datum(missing_data)         //Populate the <svg> element with chart data...
              .call(missing_chart);          //Finally, render the chart!

          //Update the chart when window resizes.
          nv.utils.windowResize(function() { missing_chart.update() });
          return missing_chart;
        });

        nv.addGraph(function() {
          delay_chart = nv.models.lineChart()
                        .margin({left: 100, right: 100})  //Adjust chart margins to give the x-axis some breathing room.
                        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                        // .transitionDuration(350)  //how fast do you want the lines to transition?
                        .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                        .showYAxis(true)        //Show the y-axis
                        .showXAxis(true)        //Show the x-axis
                        .forceY([0,maximum_delay+1])
                        .forceX([new Date(first_point.x).valueOf(), new Date().valueOf()])
          ;

          delay_chart.xAxis     //Chart x-axis settings
              .axisLabel('')
              .tickFormat(function(timestamp) {
                return d3.time.format('%I:%M:%S%p')(new Date(timestamp))
              });

          delay_chart.yAxis     //Chart y-axis settings
              .axisLabel('Temperature (c)')
              .tickFormat(d3.format(''));

          d3.select('#delay_plot')    //Select the <svg> element you want to render the chart in.
              .datum(delay_data)         //Populate the <svg> element with chart data...
              .call(delay_chart);          //Finally, render the chart!

          //Update the chart when window resizes.
          nv.utils.windowResize(function() { delay_chart.update() });
          return delay_chart;
        });
      }
      // tooltip gets messed up when data gets replaced
      d3.selectAll('.nvtooltip').remove();
      countdown = true;
    });
}
var timeout = 20;
getData();
countdown = false;
function checkFetch() {
  if(countdown) {
    timeout -= 1
    $("#refreshtime").text(timeout);
    delay_chart.forceX([new Date(first_point.x).valueOf(), new Date().valueOf()])
    delay_chart.update()
    missing_chart.forceX([new Date(first_point.x).valueOf(), new Date().valueOf()])
    missing_chart.update()
  }
  if(timeout == 0) {
    getData();
    $("#refreshtime").text('refreshing');
    timeout = 20;
    counting = false;
  }
}
setInterval(function() {
  checkFetch();
}, 1000)