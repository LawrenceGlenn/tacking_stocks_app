$('document').ready(function() {
  var data = $('.stock_info').data('stock').chart;
  var scrollTextData = $('.stock_info').data('stock').news;
  //alert($('.stock_info').data('stock').chart[0]);
  drawStockChart(parseData(data));
  drawScrollingHeadlines(scrollTextData);
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
    if (chart[i].change_over_time){
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
  }
  return arr;
}

function drawScrollingHeadlines(data) {
  const completionPause = 100;
  const millisecPerPixel = 15;
  const width = 1000;
  var svg = d3.select('svg.scrolling_headlines')
  .attr("width", width)
  .attr("height", "20px");
  var tx = svg.append("text")
    .attr("y", "1em")
    .attr("stroke", "white")
    .attr("fill", "white")
    .attr("font-family", "Sans-serif")
    .text(Array.join((data.map(function (d) {return d.headline})), " | "));

  repeat();

  var totalLength = tx.node().getComputedTextLength();

  function repeat() {
    tx.attr("dx", width)
      .transition()
      .duration(totalLength*millisecPerPixel)
      .ease(d3.easeLinear)
      .attr("dx", -(totalLength+completionPause))
      .on("end", repeat);
  };

}

function drawStockChart(data) {

  //set dimensions for the canvis the graph will be on
  var svgWidth = 1000, svgHeight = 450;
  var margin = { top: 20, right: 140, bottom: 80, left: 60 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var bisectDate = d3.bisector(d => d.date).right;
  var lineAnimationTime = 3000;
  const openColor = "gray";
  const closeColor = "steelblue";
  const highColor = "green";
  const lowColor = "red";

  var svg = d3.select('svg.stock_chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // move the drawing area over by margin to make room for the axis
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //Container for the gradients
var defs = svg.append("defs");

//Filter for the outside glow
var filter = defs.append("filter")
    .attr("id","glow");
filter.append("feGaussianBlur")
    .attr("stdDeviation", "10")
    .attr("result","coloredBlur");
var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");


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
    .y(function(d) { return y(d.close)});

  var openLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.open)});

  var lowLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.low)});

  var highLine = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.high)});


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
    .attr("id", "closeLine")
    .attr("stroke", closeColor)
    .attr("stroke-width", 1.5)
    .style("opactiy", 1)
    .attr("d", closeLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "openLine")
    .attr("stroke", openColor)
    .attr("stroke-width", 1.5)
    .style("opactiy", 1)
    .attr("d", openLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "lowLine")
    .attr("stroke", lowColor)
    .attr("stroke-width", 1.5)
    .style("opactiy", 1)
    .attr("d", lowLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "highLine")
    .attr("stroke", highColor)
    .attr("stroke-width", 1.5)
    .style("opactiy", "1")
    .attr("d", highLine);



  const crossHairs = svg.select('g').append('g')
    .attr("class", "crossHairs")
    .style("opacity", .8)
    .style('display', "none");

  crossHairs.append("circle")
    .attr("r", 6.5)
    .attr("fill", "none")
    .attr("stroke", "white");

  crossHairs.append('line')
    .classed('x', true)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3 3");

  crossHairs.append('line')
    .classed('y', true)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3 3");

  crossHairs.append("text")
    .attr('x', 8)
    .attr("fill", "white")
    .attr("dy", ".25em")
    .attr("font-size", "12px");

  svg.select("g").append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", "0")
    .on('mouseover', () => crossHairs.style('display', null))
    .on('mouseout', mouseout)
    .on("mousemove", mousemoved);

  d3.selectAll(".line")
    .style("filter", "url(#glow)");

  svg.append("text")
    .style("text-anchor", "middle")
    .attr("class", "openFilter")
    .attr("stroke", openColor)
    .attr("fill", openColor)
    .attr("font-size", 24)
    .attr("x", width/2-150)
    .attr("y", svgHeight-10)
    .style("filter", "url(#glow)")
    .text("Open")         
     .on("click", function(){
       // determine if current line is visible
       var active   = openLine.active ? false : true,
       newDisplay = active ? "none" : null
       newOpacity = active ? .3 : 1;
       // hide or show the elements
       d3.select("#openLine").attr("display", newDisplay);
       d3.select(this).attr("opacity", newOpacity);
       // update whether or not the elements are active
       openLine.active = active;
     });

  svg.append("text")
    .style("text-anchor", "middle")
    .attr("class", "closeFilter")
    .attr("stroke", closeColor)
    .attr("fill", closeColor)
    .attr("font-size", 24)
    .attr("x", width/2-50)
    .attr("y", svgHeight-10)
    .style("filter", "url(#glow)")
    .text("Close")         
     .on("click", function(){
       // determine if current line is visible
       var active   = closeLine.active ? false : true,
       newDisplay = active ? "none" : null
       newOpacity = active ? .3 : 1;
       // hide or show the elements
       d3.select("#closeLine").attr("display", newDisplay);
       d3.select(this).attr("opacity", newOpacity);
       // update whether or not the elements are active
       closeLine.active = active;
     });

  svg.append("text")
    .style("text-anchor", "middle")
    .attr("class", "highFilter")
    .attr("stroke", highColor)
    .attr("fill", highColor)
    .attr("font-size", 24)
    .attr("x", width/2+50)
    .attr("y", svgHeight-10)
    .style("filter", "url(#glow)")
    .text("High")         
     .on("click", function(){
       // determine if current line is visible
       var active   = highLine.active ? false : true,
       newDisplay = active ? "none" : null
       newOpacity = active ? .3 : 1;
       // hide or show the elements
       d3.select("#highLine").attr("display", newDisplay);
       d3.select(this).attr("opacity", newOpacity);
       // update whether or not the elements are active
       highLine.active = active;
     });

  svg.append("text")
    .style("text-anchor", "middle")
    .attr("class", "lowFilter")
    .attr("stroke", lowColor)
    .attr("fill", lowColor)
    .attr("font-size", 24)
    .attr("x", width/2+150)
    .attr("y", svgHeight-10)
    .style("filter", "url(#glow)")
    .text("Low")         
     .on("click", function(){
       // determine if current line is visible
       var active   = lowLine.active ? false : true,
       newDisplay = active ? "none" : null
       newOpacity = active ? .3 : 1;
       // hide or show the elements
       d3.select("#lowLine").attr("display", newDisplay);
       d3.select(this).attr("opacity", newOpacity);
       // update whether or not the elements are active
       lowLine.active = active;
     });

  animateLines();

  function animateLines(){
    svg.selectAll(".line")
      .each(function(x){
        var totalLength = d3.select(this).node().getTotalLength()
        d3.select(this)
          .attr("stroke-dasharray", totalLength + " " + totalLength ) 
          .attr("stroke-dashoffset", totalLength)
          .transition()
            .duration(lineAnimationTime)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
      });
  }

  function mousemoved() {
    svg.selectAll(".line")
      .attr("opacity", ".3")
      .attr("stroke-width", 1.5);
    var m = d3.mouse(this),
    p = closestPathTo(m);
    p.attr("opacity", "1")
    .attr("stroke-width", 4);
    
    d= closestDataToPoint(m);
    updateCrossHairs(d,p);
  }

  function mouseout(){
    svg.selectAll(".line")
      .attr("opacity", "1")
      .attr("stroke-width", 1.5);
    crossHairs.style('display', "none");
  }

  function updateCrossHairs(closestData, closestPath){
    var selectedData = closestData.high;
    switch(closestPath.node().id){
      case "highLine": selectedData = closestData.high;
      break;

      case "lowLine": selectedData = closestData.low;
      break;

      case "openLine": selectedData = closestData.open;
      break;

      case "closeLine": selectedData = closestData.close;
      break;
          }
      crossHairs.attr('transform', `translate(${x(closestData.date)}, ${y(selectedData)})`);
      crossHairs.select('line.x')
        .attr('x1', 0)
        .attr('x2', -x(closestData.date))
        .attr('y1', 0)
        .attr('y2', 0);

      crossHairs.select('line.y')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height - y(selectedData));

        crossHairs.select("text").text(closestPath.node().id.replace("Line","")+" price $"+d3.format(".2f")(selectedData));
  }

  function closestPathTo(m){
    var best = [0,0];
    best.distance = Infinity;
    var path;
    bestPath("highLine");
    bestPath("lowLine");
    bestPath("openLine");
    bestPath("closeLine");
    return path;

    function bestPath(pathName){
      var currentNode = svg.select("path#"+pathName).node()
    if ((best.distance > (closestPoint(currentNode, m)).distance)&& !currentNode.attributes.display){
      best = closestPoint(currentNode, m) ;
      path = svg.select("path#"+pathName);
    }
    }
  }


function closestDataToPoint(point){
  const x0 = x.invert(point[0]);
  const i = bisectDate(data, x0, 2);
  const d0 = data[i-1];
  const d1 = data[i];
  const d = x0 - d0 < d1 - x0 ? d1 : d0;

  return d;
}

}

//a function that determines the closest point to a line

function closestPoint(pathNode, point){
  var pathLength = pathNode.getTotalLength(),
  precision = 10,
  best,
  bestLength,
  bestDistance = Infinity;

  //distance to point
  function distanceToPoint(p) {
    var dx = p.x - point[0], dy= p.y - point[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  //determine first best guess
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distanceToPoint(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search to determine estimate to recision value
  precision /= 2;
  while (precision > 0.5) {
    var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 &&
      (beforeDistance = distanceToPoint(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength &&
      (afterDistance = distanceToPoint(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x , best.y];
  best.distance = bestDistance;
  return best;
}
