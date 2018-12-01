$('document').ready(function() {
var chart = $('.stock_info').data('stock').chart;
//alert($('.stock_info').data('stock').chart[0].date);
drawChart(parseData(chart));
});

function parseData(chart) {
   var arr = [];
   for (var i in chart) {
      arr.push(
         {
            date: new Date(chart[i].date),  //convert string to number
            close: +chart[i].close //convert string to number
         });
   }
   return arr;
}

function drawChart(chart) {

  var svgWidth = 1000, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleTime().rangeRound([0, width]);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(d3.extent(chart, function(d) { return d.date }));
  y.domain(d3.extent(chart, function(d) { return d.close }));

  var line = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.close)})

g.append("g")
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x))
   .select(".domain")
   .remove();

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

  g.append("path")
    .datum(chart)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);


  }