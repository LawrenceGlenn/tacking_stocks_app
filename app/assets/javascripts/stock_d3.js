$('document').ready(function() {
var data = $('.stock_info').data('stock').chart;
//alert($('.stock_info').data('stock').chart[0]);
drawStockChart(parseData(data));
});

function parseData(chart) {
  var arr = [];
  //create a d3 parser to format the time
  var myTimeParser = d3.timeParse("%Y-%m-%d ");
  var time = "";
  for (var i in chart) {
    if(chart[i].label.includes(" AM") || chart[i].label.includes(" PM")){
      time = chart[i].label;
      myTimeParser = (chart[i].label.includes(":"))? d3.timeParse("%Y-%m-%d %H:%M %p") : d3.timeParse("%Y-%m-%d %H %p");    
    }
    arr.push(
      {
        //combine time of day and date and parse it into d3 format
        date: myTimeParser(chart[i].date+" "+time),
        close: +chart[i].close, //convert string to number
        open: +chart[i].open, //convert string to number
        low: +chart[i].low, //convert string to number
        high: +chart[i].high //convert string to number
    });
   }
  return arr;
}

function drawStockChart(data) {

  //set dimensions for the canvis the graph will be on
  var svgWidth = 600, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // move the drawing area over by margin to make room for the axis
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //set the range of the graph
  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  //create a domain for the graph, including all the different values for y
  x.domain(d3.extent(data, function(d) { return d.date }));
  y.domain(d3.extent(
    [].concat(data.map(function (d) {return d.open}))
    .concat(data.map(function (d) {return d.close}))
    .concat(data.map(function (d) {return d.low}))
    .concat(data.map(function (d) {return d.high}))
    ));

  //create lines
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
    .style("text-anchor", "end")
    .text("Price ($)");

  //create the lines on the graph
  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", closeLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", openLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", lowLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", highLine);


    highlightOnHover(svg, svg.selectAll(".line"));


  }

function highlightOnHover(svg, path) {
  
  if ("ontouchstart" in document) svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchmove", moved)
      .on("touchstart", entered)
      .on("touchend", left)
  else svg
      .on("mousemove", moved)
      .on("mouseenter", entered)
      .on("mouseleave", left);

  function moved() {
  }

  function entered() {
    svg.attr("opacity", ".1");
  }

  function left() {
    svg.attr("opacity", "1");
  }
}