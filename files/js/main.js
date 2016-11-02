var data_url = 'https://beaglebone-hvac-demo.apps.exosite.io/data' // url for getting data - should be raw tsdb response
var omit_keys = ['pid', 'time'] // list of keys to not plot
var timeout = 20; // timeout to refresh
var force_current_timestamp = true;

var chart;
var plot_indices = {}

var c10 = d3.scale.category10();

var charts = {};

function createChart(data, id) {
  if(!id) {
    id = 'chart'
  }

  var min_datapoint = _.minBy(_.map(data, function(series) {
    return _.minBy(series.values, 'y')
  }), 'y')
  var plot_min = min_datapoint.y - 1

  var max_datapoint = _.maxBy(_.map(data, function(series) {
    return _.maxBy(series.values, 'y')
  }), 'y')
  var plot_max = max_datapoint.y + 1

  nv.addGraph(function() {
    var chart = nv.models.lineChart()
                  .margin({left: 100, right: 100})  //Adjust chart margins to give the x-axis some breathing room.
                  .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                  // .transitionDuration(350)  //how fast do you want the lines to transition?
                  .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                  .showYAxis(true)        //Show the y-axis
                  .showXAxis(true)        //Show the x-axis
                  .forceY([plot_min, plot_max])

    if(force_current_timestamp) {
      var min_timestamp = _.minBy(_.map(data, function(series) {
        return _.minBy(series.values, 'x')
      }), 'x')

      chart.forceX([new Date(min_timestamp.x).valueOf(), new Date().valueOf()])
    }

    chart.xAxis     //Chart x-axis settings
        .axisLabel('')
        .showMaxMin(false)
        .tickFormat(function(timestamp) {
          return d3.time.format('%m/%d %I:%M:%S%p')(new Date(timestamp))
        });

    chart.yAxis     //Chart y-axis settings
        .axisLabel('')
        .tickFormat(d3.format(''));

    d3.select('#'+id)    // Select the <svg> element you want to render the chart in.
        .datum(data)       // Populate the <svg> element with chart data...
        .call(chart);      // Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });
    charts[id] = chart;
    return chart;
  });
  // tooltip gets messed up when data gets replaced
  d3.selectAll('.nvtooltip').remove();
  countdown = true;
}

function makePlot(response) {
  if(response.results) {
    var plot = [];
    var data = response.results[0].series
    _.each(data, function(series) {
      var time_index;
      _.each(series.columns, function(column, column_index) {
        if(column == 'time') {
          time_index = column_index;
          return
        } else {
          if(omit_keys.indexOf(column) == -1) {
            var graph = {
              key: column,
              values: [],
              color: c10(column)
            }
            plot.push(graph)
            plot_indices[column] = plot.length-1;
          }
        }
      })

      _.each(series.values, function(row, row_index) {
        var timestamp = new Date(row[time_index])
        _.each(row, function(value, value_index) {
          if(value_index == time_index) {
            return;
          } else {
            var key = series.columns[value_index]
            var series_index = plot_indices[key]
            if(omit_keys.indexOf(key) == -1 && value !== null) {
              var point = {
                x: timestamp,
                y: value
              }
              // add point to our series
              plot[series_index].values.push(point)
            }
          }
        })
      })
    })

    // if you want to display all data on a single plot, uncomment this line and comment the next ones out
    // the 2nd parameter is the ID of where to put the chart - must be a div in the html
    // createChart(plot, 'chart')
    _.each(plot, function(series) {
      createChart([series], series.key)
    })
  }

  // make sure data is sorted
  plot = _.sortBy(plot, (series) => {
    series.values = _.sortBy(series.values, 'x')
    return series
  })

  var minimum_timestamp = _.min(_.map(plot, function(series) {
    return series.values[0]
  }), 'x')

}

function getData() {
  var dataRequest = new Request(data_url);

  fetch(dataRequest)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      makePlot(response)
    })
}

getData();

var countdown = false;
function checkFetch() {
  if(countdown) {
    timeout -= 1
    $("#refreshtime").text(timeout);
    if(force_current_timestamp) {
      _.each(charts, function(chart) {
        var min = chart.forceX()[0];
        chart.forceX([min, new Date().valueOf()])
        chart.update();
      })
    }
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
