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
  var svgWidth = 1000, svgHeight = 450;
  var margin = { top: 20, right: 140, bottom: 60, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var bisectDate = d3.bisector(d => d.date).right;
  var lineAnimationTime = 3000;

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
    .attr("id", "closeLine")
    .attr("stroke", "steelblue")
    .attr("d", closeLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "openLine")
    .attr("stroke", "gray")
    .attr("d", openLine);

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "lowLine")
    .attr("stroke", "red")
    .attr("d", lowLine);

  var path = g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("id", "highLine")
    .attr("stroke", "green")
    .attr("d", highLine);



  const crossHairs = svg.select('g').append('g')
    .attr("class", "crossHairs")
    .style("opacity", .8);

  crossHairs.append("circle")
    .attr("r", 4.5)
    .attr("fill", "none")
    .attr("stroke", "black");

  crossHairs.append('line')
    .classed('x', true)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3 3");

  crossHairs.append('line')
    .classed('y', true)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "3 3");

  crossHairs.append("text")
    .attr('x', 8)
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
    svg.selectAll(".line").attr("opacity", ".2");
    var m = d3.mouse(this),
    p = closestPathTo(m);
    p.attr("opacity", "1");
    
    d= closestDataToPoint(m);
    updateCrossHairs(d,p);
  }

  function mouseout(){
    svg.selectAll(".line").attr("opacity", "1");
    crossHairs.style('display', "none")
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
    var path = svg.select("path#highLine");
    var best = closestPoint(path.node(), m);
    if (best.distance > (closestPoint(svg.select("path#lowLine").node(), m)).distance){
      best = closestPoint(svg.select("path#lowLine").node(), m) ;
      path = svg.select("path#lowLine");
    }
    if (best.distance > (closestPoint(svg.select("path#closeLine").node(), m)).distance){
      best = closestPoint(svg.select("path#closeLine").node(), m) ;
      path = svg.select("path#closeLine");
    }
    if (best.distance > (closestPoint(svg.select("path#openLine").node(), m)).distance){
      best = closestPoint(svg.select("path#openLine").node(), m) ;
      path = svg.select("path#openLine");
    }
    return path;
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