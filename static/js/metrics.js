// Define margins


var margin = {top: 50, right: 300, bottom: 50, left: 100},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// a parser for the date
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

// a scale for the time
var xScale = d3.time.scale()
  .nice()
  .range([0, width]);

// a scale for every axis
var usersScale = d3.scale.linear()
    .range([height, 0]);
usersScale.ticks(10);
var tripsScale = d3.scale.linear()
    .range([height, 0]);
tripsScale.ticks(10);
var hoursScale = d3.scale.linear()
    .range([height, 0]);
hoursScale.ticks(10);
var milesScale = d3.scale.linear()
    .range([height, 0]);
milesScale.ticks(10);

// a color scale for all the series
var color = d3.scale.category10();

// the proper xAxis based on the scale
var xAxis = d3.svg.axis()
    .ticks(10)
    .scale(xScale)
    .orient("bottom");

// the proper y axis based on the scale
var usersAxis = d3.svg.axis()
    .ticks(5)
    .scale(usersScale)
    .orient("left");
var tripsAxis = d3.svg.axis()
    .ticks(5)
    .scale(tripsScale)
    .orient("right");
var hoursAxis = d3.svg.axis()
    .ticks(5)
    .scale(hoursScale)
    .orient("left");
var milesAxis = d3.svg.axis()
    .ticks(5)
    .scale(milesScale)
    .orient("right");

// Create a brush to zoom in on the graph
var brush = d3.svg.brush()
    .x(xScale)
    .on("brushend", brushend);

// the line object that will be used
var lineUsers = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return usersScale(d.data); });
var lineTrips = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return tripsScale(d.data); });
var lineHours = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return hoursScale(d.data); });
var lineMiles = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return milesScale(d.data); });
var lines = {'users': lineUsers, 'trips': lineTrips, 'hours': lineHours, 'miles': lineMiles};

// Graph with users and trips
var svgUsers = d3.select("#graph1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Graph with hours and miles
var svgHours = d3.select("#graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// All the data is imported


// Append axis and labels for the first graph
svgUsers.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

svgUsers.append("g")
    .attr("class", "yUsers")
    .call(usersAxis)
    .append("g")
    .attr("transform", "translate(-60, 0)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Users");

svgUsers.append("g")
    .attr("class", "yTrips")
    .attr("transform", "translate(" + String(width) + ", 0)")
    .call(tripsAxis)
    .append("g")
    .attr("transform", "translate(-30, -10)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Trips");

// Append the brush
svgUsers.append("g")
    .attr("class", "brush")
    .call(brush)
  .selectAll('rect')
    .attr('height', height);

// Append a clip to mask the curve outside of bonderies
svgUsers.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);


// Append axis and labels for the second graph
svgHours.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

svgHours.append("g")
    .attr("class", "yHours")
    .call(hoursAxis)
    .append("g")
    .attr("transform", "translate(-60, -10)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Hours Recorded");

svgHours.append("g")
    .attr("class", "yMiles")
    .attr("transform", "translate(" + String(width) + ", 0)")
    .call(milesAxis)
    .append("g")
    .attr("transform", "translate(-30, -10)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Miles Recorded");

// Append the brush
svgHours.append("g")
    .attr("class", "brush")
    .call(brush)
  .selectAll('rect')
    .attr('height', height);

// Append a clip to mask the curve outside of bonderies
svgHours.append("defs").append("clipPath")
    .attr("id", "clip2")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

// hold paths
var usersGroup;
var hoursGroup;

// Add some variables to the data (name and visible)
users = add_data1("users", 0, users);
trips = add_data1("trips", 1, trips);
hours = add_data2("hours", 0, hours);
miles = add_data2("miles", 1, miles);

// Scale the x axis with min and max time values
xScale.domain(d3.extent(users[0].values, function(d) { return d.time; }));

reset_axis();

// Draw each curve and add the legend
draw_curve1(users, usersScale, lineUsers);
draw_curve1(trips, tripsScale, lineTrips);
draw_curve2(hours, hoursScale, lineHours);
draw_curve2(miles, milesScale, lineMiles);
reset_y_axis();

// Draw legend
draw_legend1();
draw_legend2();


function draw_legend1() {
  var legendSpace = 50; // 450/number of issues (ex. 40)
  var legende1 = d3.select("#graph1").selectAll(".usersGroup")
      .append("rect")
      .attr("class", "myRect")
      .attr("width", 30)
      .attr("height", 15)
      .attr("x", width + 50)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 50; })  // spacing
      .attr("fill",function(d) {
          return d.visible ? d.color : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
          })
      .attr("class", "legend-box")
      .attr("stroke", "#000000")
      .on("click", function(d){
          // Toggle
          d.visible = !d.visible

          // Toggle lines
          d3.select("#graph1").selectAll(".line")
            .transition()
            .attr("d", function(d) { return d.visible ? lines[d.name](d.values): null; });


          // Toggle color in legend
          legende1.transition()
            .attr("fill", function(d) {
            return d.visible ? d.color : "#F1F1F2";
          });
      });

  d3.select("#graph1").selectAll(".usersGroup")
      .append("text")
      .attr("x", width + 50 + 40)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 40; })
      .text(function(d) { return d.name; });
}

function draw_legend2() {
  var legendSpace = 50; // 450/number of issues (ex. 40)
  var legende2 = d3.select("#graph2").selectAll(".hoursGroup")
      .append("rect")
      .attr("class", "myRect")
      .attr("width", 30)
      .attr("height", 15)
      .attr("x", width + 50)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 50; })  // spacing
      .attr("fill",function(d) {
          return d.visible ? d.color : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
          })
      .attr("class", "legend-box")
      .attr("stroke", "#000000")
      .on("click", function(d){
          // Toggle
          d.visible = !d.visible

          // Toggle lines
          d3.select("#graph2").selectAll(".line")
            .transition()
            .attr("d", function(d) { return d.visible ? lines[d.name](d.values): null; });


          // Toggle color in legend
          legende2.transition()
            .attr("fill", function(d) {
            return d.visible ? d.color : "#F1F1F2";
          });
      });

  d3.select("#graph2").selectAll(".hoursGroup")
      .append("text")
      .attr("x", width + 50 + 40)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 40; })
      .text(function(d) { return d.name; });
}

function add_data1(name, colorIndex, data){
  // convert string to datetime
  data.forEach(function(d) {
    d.time = parseDate(d.time)
  });

  // Create a new structure
  var temp = {

    name: name,
    values: data,
    color: color(colorIndex),
    visible: true,

  };

  var newData = [];
  newData.push(temp);
  return newData;
}

function add_data2(name, colorIndex, data) {
  // convert string to datetime
  data.forEach(function(d) {
    d.time = parseDate(d.time)
  });

  // Create a new structure
  var temp = {

    name: name,
    values: data,
    color: color(colorIndex),
    visible: true,

  };

  var newData = [];
  newData.push(temp);
  return newData;
}

function draw_curve1(data, yScale, line){

  // Scale the y axis for speed, elevation and SOC
 yScale.domain([ d3.min(data[0].values, function(d) { return d.data;}),
                  d3.max(data[0].values, function(d) { return d.data;})]);

  // select all locations and bound group to non existant location
  usersGroup = svgUsers.selectAll(".dsfgagrge")
                  .data(data)
                  .enter().append("g")
                  .attr("class", "usersGroup");

  usersGroup.append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr("d", function(d) { return d.visible ? line(d.values): null;})
      .style("stroke", function(d) { return d.color; });

}


function draw_curve2(data, yScale, line){
  // Scale the y axis for speed, elevation and SOC
  yScale.domain([ d3.min(data[0].values, function(d) { return d.data;}),
                  d3.max(data[0].values, function(d) { return d.data;})]);

  // select all locations and bound group to non existant location
  hoursGroup = svgHours.selectAll(".dsfgagrge")
                  .data(data)
                  .enter().append("g")
                  .attr("class", "hoursGroup");

  hoursGroup.append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr("d", function(d) { return d.visible ? line(d.values): null;})
      .style("stroke", function(d) { return d.color; });
}

function brushend() {
  get_button = d3.select(".clear-button");
  if(get_button.empty() === true) {
    clear_button = hoursGroup.append('text')
      .attr("y", height)
      .attr("x", width)
      .attr("class", "clear-button")
      .text("Clear Brush");
  }

  domain = brush.extent();
  xScale.domain(domain);

  transition_data();
  reset_axis();

  d3.selectAll(".brush").call(brush.clear());

  clear_button.on('click', function(){
    xScale.domain(d3.extent(hours[0].values, function(d) { return d.time; }));
    transition_data();
    reset_axis();
    clear_button.remove();
  });
}

function transition_data() {
  d3.select("#graph1").selectAll(".line")
    .transition()
    .attr("d", function(d) { return d.visible ? lines[d.name](d.values): null; });

  d3.select("#graph2").selectAll(".line")
    .transition()
    .attr("d", function(d) { return d.visible ? lines[d.name](d.values): null; });

}

function reset_axis() {
  svgUsers.transition().duration(500)
   .select(".x.axis")
   .call(xAxis);

  svgHours.transition().duration(500)
   .select(".x.axis")
   .call(xAxis);
}

function reset_y_axis() {
  svgUsers.transition().duration(500)
   .select(".yUsers")
   .call(usersAxis);

  svgUsers.transition().duration(500)
   .select(".yTrips")
   .call(tripsAxis);

  svgHours.transition().duration(500)
   .select(".yHours")
   .call(hoursAxis);

  svgHours.transition().duration(500)
   .select(".yMiles")
   .call(milesAxis);
}

