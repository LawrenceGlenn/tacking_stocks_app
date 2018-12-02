$('document').ready(function() {
var chart = $('.stock_info').data('stock').chart;
//alert($('.stock_info').data('stock').chart[0]);
drawChart(parseData(chart));
});

function parseData(chart) {
   var arr = [];
   for (var i in chart) {
      arr.push(
         {
            date: new Date(chart[i].date),  //convert string to number
            close: +chart[i].close, //convert string to number
            open: +chart[i].open, //convert string to number
            low: +chart[i].low, //convert string to number
            high: +chart[i].high //convert string to number
         });
   }
   return arr;
}

function drawChart(chart) {

  //set dimensions for the canvis the graph will be on
  var svgWidth = 600, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//set the range of the graph
  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(d3.extent(chart, function(d) { return d.date }));
  y.domain(d3.extent(
    [].concat(chart.map(function (d) {return d.open}))
    .concat(chart.map(function (d) {return d.close}))
    .concat(chart.map(function (d) {return d.low}))
    .concat(chart.map(function (d) {return d.high}))
    ));

  var closeLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.close)})

  var openLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.open)})

  var lowLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.low)})

  var highLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.high)})

//Add the X axis
g.append("g")
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

//Add the Y axis
  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .text("Price ($)");

  g.append("path")
    .datum(chart)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", closeLine);

  g.append("path")
    .datum(chart)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", openLine);

  g.append("path")
    .datum(chart)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", lowLine);

  g.append("path")
    .datum(chart)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", highLine);


  }