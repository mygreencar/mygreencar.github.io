// The same values should be used on the profile.html page
var red = '#d35400';
var green = '#27ae60';

// Define margins

var chartWidth = 960,
    barHeight = 50;

var barsHeight = barHeight * mpgData.length // total height of all bars

// MPG Graphs
// sort mpg data from least to greatest
mpgData.sort(function (a, b){
    mpg_a = +a['mpg'];
    mpg_b = +b['mpg'];

    return mpg_b - mpg_a;
});

//Set up margins

var margin = {top: 40, right: 40, bottom: 40, left: 200, titleBottom: "-1em"},
width = Math.min(700, $('.col-xs-12').width()) - margin.left - margin.right,
height = barsHeight;

// Set up scales
var mpgyScale = d3.scale.ordinal()
.domain(mpgData.map(function(d) {
    return d['car_type']
}))
.rangePoints([0, height - barHeight + 5]);

// the data is already sorted so simply use the last and first elements as the domain
var mpgColorDomain = [+mpgData[mpgData.length - 1]['mpg'], +mpgData[0]['mpg']];
var mpgDomain = [0, mpgColorDomain[1]];   

var mpgxScale = d3.scale.linear()
.domain(mpgDomain)
.range([0, width]);

var mpgColorScale = d3.scale.linear()
    .domain(mpgColorDomain)
    .range([red, green]);

//Create axes
var mpgyAxis = d3.svg.axis()
    .scale(mpgyScale)
    .tickPadding(10)
    .tickSize(0)
    .orient("left");

function adjustTextLabels(selection) {
    selection.selectAll('.y.axis text')
        .attr('transform', 'translate( 0,' + parseInt(barHeight / 2) + ')');
}
// Create graphs
var mpgChart = d3.select("#mpg-summary")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var mpgBar = mpgChart.selectAll("g")
    .data(mpgData)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + mpgyScale(d['car_type']) + ")";  });

mpgBar.append("rect")
    .attr("width", function(d) { return mpgxScale(parseFloat(d['mpg'])); })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return mpgColorScale(d['mpg']);
    });
    //.transition()
    //.attr("width",320)
    //.duration(1000)
    //.delay(2000);

// Append in-bar text
mpgBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) {
        if (d['mpg'] >= 200) {
            return 'Infinite MPG';
        }
        return d['mpg'] + " MPG";
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
mpgChart.append("g")
.attr("class", "y axis")
.attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
.call(mpgyAxis)
.call(adjustTextLabels)
.attr('stroke-width', '0px');

// Append title
mpgChart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2) 
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Average Trip MPG");

$('#mpg-summary').on('appear', function(event, $all_appeared_elements) {
  // this element is now inside browser viewport
  console.log("hello");
});

// Fuel Consumed Graphs

var fuelConsumedElectrical = fuelData.filter( function(d) { 
    return d['type'] === 'electrical' || d['type'] === 'PHEV';
}).sort(function(a, b) {
    return +a['deltaSOC'] - +b['deltaSOC'];
});

var fuelConsumedConventional = fuelData.filter( function(d) { 
    return d['type'] === 'conventional' || d['type'] === 'HEV' || d['type'] === 'PHEV';
}).sort(function(a, b) {
    return +a['fuelConsumed'] - +b['fuelConsumed'];
});
// Set up scales

// y-scales

var fuelConsumedElectricalYScale = d3.scale.ordinal()
.domain(fuelConsumedElectrical.map( function(d){ return d['car_type']; }))
.rangePoints([0, barHeight * fuelConsumedElectrical.length - barHeight + 5]);

var fuelConsumedConventionalYScale = d3.scale.ordinal()
.domain(fuelConsumedConventional.map( function(d){ return d['car_type']; }))
.rangePoints([0, barHeight * fuelConsumedConventional.length - barHeight + 5]);

// x-scales
var electricalColorDomain = d3.extent(fuelConsumedElectrical, function(d) { return parseFloat(d['deltaSOC']); });
var electricalDomain = [0, electricalColorDomain[1]];
var fuelConsumedElectricalXScale = d3.scale.linear()
.domain(electricalDomain)
.range([0, width]);

var conventionalColorDomain = d3.extent(fuelConsumedConventional, function(d) { return parseFloat(d['fuelConsumed']); });
var conventionalDomain = [0, conventionalColorDomain[1]];
var fuelConsumedConventionalXScale = d3.scale.linear()
.domain(conventionalDomain)
.range([0, width]);

var electricalColorScale = d3.scale.linear()
    .domain(electricalColorDomain)
    .range([green, red]);

var conventionalColorScale = d3.scale.linear()
    .domain(conventionalColorDomain)
    .range([green, red]);

// Set up chart

var fuelConsumedElectricalChart = d3.select("#fuel-consumed-electrical")
    .attr("width", width + margin.left + margin.right)
    .attr("height", barHeight * fuelConsumedElectrical.length + margin.top + margin.bottom);

var fuelConsumedElectricalBar = fuelConsumedElectricalChart.selectAll("g")
    .data(fuelConsumedElectrical)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + fuelConsumedElectricalYScale(d['car_type']) + ")";  });

fuelConsumedElectricalBar.append("rect")
    .attr("width", function(d) { return fuelConsumedElectricalXScale(parseFloat(d['deltaSOC'])); })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return electricalColorScale(parseFloat(d['deltaSOC']));
    });

var fuelConsumedConventionalChart = d3.select("#fuel-consumed-conventional")
    .attr("width", width + margin.left + margin.right)
    .attr("height", barHeight * fuelConsumedConventional.length + margin.top + margin.bottom);

var fuelConsumedConventionalBar = fuelConsumedConventionalChart.selectAll("g")
    .data(fuelConsumedConventional)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + fuelConsumedConventionalYScale(d['car_type']) + ")";  });

fuelConsumedConventionalBar.append("rect")
    .attr("width", function(d) { return fuelConsumedConventionalXScale(parseFloat(d['fuelConsumed'])); })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return conventionalColorScale(parseFloat(d['fuelConsumed']));
    });

// Append in-bar text
fuelConsumedElectricalBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) { return d['deltaSOC'] + "%"; })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fuelConsumedConventionalBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) { return d['fuelConsumed'] + " gal"; })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Create axes
var fuelConsumedElectricalYAxis = d3.svg.axis()
    .scale(fuelConsumedElectricalYScale)
    .tickPadding(10)
    .tickSize(0)
    .orient("left");

var fuelConsumedConventionalYAxis = d3.svg.axis()
    .scale(fuelConsumedConventionalYScale)
    .tickPadding(10)
    .tickSize(0)
    .orient("left");

// Append axes
fuelConsumedElectricalChart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
    .call(fuelConsumedElectricalYAxis)
    .call(adjustTextLabels)
    .attr("stroke-width", "0px");

fuelConsumedConventionalChart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
    .call(fuelConsumedConventionalYAxis)
    .call(adjustTextLabels)
    .attr("stroke-width", "0px");

// Append title
fuelConsumedElectricalChart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2)              
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Fuel Consumed - Electric Vehicles");

fuelConsumedConventionalChart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2)  
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title")  
    .text("Fuel Consumed - Conventional Vehicles");


// Set up scales
fuelData.sort(function(a, b) {
    return +a['balloons'] - +b['balloons'];
});
    
var co2ColorDomain = d3.extent(fuelData, function(d) { return parseFloat(d['balloons']); });
var co2Domain = [0, co2ColorDomain[1]];

var co2yScale = d3.scale.ordinal()
.domain(fuelData.map(function(d) { 
    return d['car_type']; 
}))
.rangePoints([0, height - barHeight + 5]);

var co2xScale = d3.scale.linear()
.domain(co2Domain) 
.range([0, width]);

var co2ColorScale = d3.scale.linear()
    .domain(co2ColorDomain)
    .range([green, red]);

//Create axes
var co2yAxis = d3.svg.axis()
    .scale(co2yScale)
    .tickPadding(10)
    .tickSize(0)
    .orient("left");

var co2Chart = d3.select("#co2-summary")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var co2Bar = co2Chart.selectAll("g")
    .data(fuelData)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + co2yScale(d['car_type']) + ")";  });

co2Bar.append("rect")
    .attr("width", function(d) { 
        return co2xScale(parseFloat(d['balloons']));
    })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return co2ColorScale(parseFloat(d['balloons']));
    });

// Append in-bar text
co2Bar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) { 
        return (parseFloat(d['balloons'])).toFixed(2) + " balloons"; 
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
co2Chart.append("g")
.attr("class", "y axis")
.attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
.call(co2yAxis)
.call(adjustTextLabels)
.attr("stroke-width", "0px");

// Append title
co2Chart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2)
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("CO2 Emissions");        


function redrawCO2Graph() {
    var co2Unit = $("#co2 option:selected").val();
    // // old code // //
    // if (co2Unit === 'balloons'){
    //     // assuming 430.44 balloons/gal-gasoline
    //     converterUnit = 430.44;
    // }else if (co2Unit === 'kg-CO2'){
    //     // assuming 19.64 lbs-CO2/gal-gasoline
    //     converterUnit = 8.91;

    // }else if (co2Unit === 'lbs-CO2'){
    //     // assuming 19.64 lbs-CO2/gal-gasoline
    //     converterUnit = 19.64;

    // }else if (co2Unit === 'tree-years'){
    //     // 0.40917 tree-year/gal-gasoline
    //     converterUnit = 0.40917;

    // }

    // var co2xScale = d3.scale.linear()
    // .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['fuelConsumed']) * converterUnit; })])
    // .range([0, width]);

    // //new code // // 
    // if (co2Unit === 'balloons'){
    //     var co2xScale = d3.scale.linear()
    //     .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['balloons']); })])
    //     .range([0, width]);
    // }
    // else if (co2Unit === 'kg-CO2'){
    //     var co2xScale = d3.scale.linear()
    //     .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['kg-CO2']); })])
    //     .range([0, width]);
    // }
    // else if (co2Unit === 'lbs-CO2'){
    //     var co2xScale = d3.scale.linear()
    //     .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['lbs-CO2']); })])
    //     .range([0, width]);
    // }
    // else if (co2Unit === 'tree-years'){
    //     var co2xScale = d3.scale.linear()
    //     .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['tree-years']); })])
    //     .range([0, width]);
    // }
    // else{
    //     var co2xScale = d3.scale.linear()
    //     .domain([0, d3.max(fuelConsumedConventional, function(d) { return parseFloat(d['balloons']); })])
    //     .range([0, width]);
    // }



    // co2Bar.selectAll("rect")
    // .attr("width", function(d) { 
    //     if (d['type'] === 'electrical'){
    //         // Assuming electrical vehicles do not output CO2 emissions
    //         return co2xScale(0);

    //     }else if (d['type'] === 'conventional'){
    //         // Assuming 430.44 balloons CO2/gal-gasoline
    //         if (co2Unit === 'balloons'){
    //             return co2xScale(parseFloat(d['balloons']));
    //         }
    //         else if (co2Unit === 'kg-CO2'){
    //             return co2xScale(parseFloat(d['kg-CO2']));
    //         }
    //         else if (co2Unit === 'lbs-CO2'){
    //             return co2xScale(parseFloat(d['lbs-CO2']));
    //         }
    //         else if (co2Unit === 'tree-years'){
    //             return co2xScale(parseFloat(d['tree-years']));
    //         }
    //         else{
    //             return co2xScale(parseFloat(d['fuelConsumed']) * converterUnit );
    //         }
            
    //     }
    // });

    co2Bar.selectAll("text")
    .text(function(d) {
        return parseFloat(d[co2Unit]).toFixed(2) + ' ' + co2Unit;
    });
}
var co2Select = document.getElementById("co2");
co2Select.addEventListener("change", redrawCO2Graph);

// Set up scales
function fuelCost(carData, gas_cost, elec_cost) {
    var cost = 0;
    if (carData['type'] === 'conventional' 
            || carData['type'] === 'HEV'
            || carData['type']  === 'PHEV') {
        cost += +carData['fuelConsumed'] * gas_cost;
    }
    if (carData['type'] === 'electrical' || carData['type'] === 'PHEV') {
        // (Decimal amount of state of charge change)
        // * (total battery energy) * (electricity cost)
        cost += ((+carData['deltaSOC']) / 100 ) 
                * +carData['battery_kWh'] * elec_cost;
    }
    return cost;
}

fuelData.sort(function(a, b) {
    return fuelCost(a, gas_price) 
        - fuelCost(b, gas_price);
});

var costyScale = d3.scale.ordinal()
.domain(fuelData.map(function(d) {
    return d['car_type'];
}))
.rangePoints([0, height - barHeight + 5]);

var costColorDomain = d3.extent(fuelData, function(d) {
    return fuelCost(d, gas_price)
});

var costDomain = [0, costColorDomain[1]];

var costxScale = d3.scale.linear()
.domain(costDomain)
.range([0, width]);

var costColorScale = d3.scale.linear()
    .domain(costColorDomain)
    .range([green, red]);


//Create axes
var costyAxis = d3.svg.axis()
    .scale(costyScale)
    .tickPadding(10)
    .tickSize(0)
    .orient("left");

var costChart = d3.select("#cost-summary")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var costBar = costChart.selectAll("g")
    .data(fuelData)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + costyScale(d['car_type']) + ")";  });

costBar.append("rect")
    .attr("width", function(d) { 
        return costxScale(fuelCost(d, gas_price, elec_price));
    })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return costColorScale(fuelCost(d, gas_price, elec_price));
    });

// Append in-bar text
costBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) { 
        return "$" + (parseFloat(fuelCost(d, gas_price, elec_price))).toFixed(2);
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
costChart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
    .call(costyAxis)
    .call(adjustTextLabels)
    .attr("stroke-width", "0px");

// Append title
costChart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2)
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Fuel Cost");   
function redrawCostGraph(fuelPrice, elecPrice) {
    var costColorDomain = d3.extent(fuelData, function(d) {
        return fuelCost(d, fuelPrice, elecPrice)
    });

    var costDomain = [0, costColorDomain[1]];

    var costxScale = d3.scale.linear()
    .domain(costDomain)
    .range([0, width]);


    var costColorScale = d3.scale.linear()
        .domain(costColorDomain)
        .range([green, red]);
    
    costBar.selectAll('rect')
        .transition()
        .attr('width', function(d) {
            return costxScale(fuelCost(d, fuelPrice, elecPrice));
        })
        .attr('fill', function(d) {
            return costColorScale(fuelCost(d, fuelPrice, elecPrice));
        });
    
    costBar.selectAll("text")
        .text(function(d) { 
            return "$" + (parseFloat(fuelCost(d, fuelPrice, elecPrice))).toFixed(2);
        })
}       
$('#fuel-input-form').submit(function(e){
    e.preventDefault();
    var fuelCost = parseFloat($("#fuel-cost").val());
    redrawCostGraph(fuelCost, elec_price);
});
// Map script copied from trips.html

init_map();
function init_map(){

    // Initiate the map
    //var first_pos = [parseFloat("{{ first_pos.0 }}")]
    //first_pos.push(parseFloat("{{ first_pos.1 }}"))
   // var last_pos = [parseFloat("{{ last_pos.0 }}")]
   // last_pos.push(parseFloat("{{ last_pos.1 }}"))
    first_latlng = new google.maps.LatLng(first_pos[0], first_pos[1])
    last_latlng = new google.maps.LatLng(last_pos[0], last_pos[1])

    map = new google.maps.Map(document.getElementById("map"), {
      center: first_latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      panControl: true,
      scrollwheel: false,
      mapTypeControl: false,
      panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(first_latlng);
    bounds.extend(last_latlng);
    map.fitBounds(bounds);

    // Parse the data
   // var datatemp = "{{ pos_list }}";
    //if (datatemp != "None") {
    //  var datatemp2 = (datatemp).replace(/&#39;/g, "\"");
     // var data = jQuery.parseJSON(datatemp2);
    //}

    // Using Rainbowvis.js library to make a color gradient to color-code the speed of the route
    var myRainbow = new Rainbow();

    myRainbow.setNumberRange(Math.round(min_speed), Math.round(max_speed));
    myRainbow.setSpectrum('#d35400', '#27ae60');
    
    // Loop over each position, and draw it
    var polyline_coords = [];
    var colors_list = [];
    var time_speed = [];
    var data = mapData;
    for(var i=0; i < data.length; i++) {
        var lat = parseFloat(data[i].latitude);
        var longitude = parseFloat(data[i].longitude);
        var speed = parseFloat(data[i].speed);
        var pos = new google.maps.LatLng(lat, longitude);
        // var altitude = parseFloat(data[i].altitude);
        polyline_coords.push(pos);
        var color = '#' + myRainbow.colourAt(speed);
        colors_list.push(color);
        // We replace the dashes in the timestamp with spaces because Firefox doesn't recognize it as a valid date with the dashes
        var date = new Date(data[i].timestamp.replace("-", " ", "g"));
        time_speed.push({x:date, y:speed*2.237});
        //time_altitude.push({x:date, y:altitude*3.281});
        // Every 2 points has a separate polyline between them, color-coded for their speed.
        // It takes longer to draw, especially for large routes, but the route is now color-coded into 5 speed quintiles.
        if (i > 0) {
            var polyline = new google.maps.Polyline({
                map: map, 
                path: [polyline_coords[i-1], polyline_coords[i]],
                strokeColor: colors_list[i],
                strokeOpacity: 1.0,
                strokeWeight: 5
            });
        }
    }

    // Place markers at the beginning and end of the trip. The beginning of the trip uses a green icon.
    var marker = new google.maps.Marker({
        position: polyline_coords[0],
        map: map,
        title: "Beginning of trip",
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
    var end_len = polyline_coords.length-1;
    var marker2 = new google.maps.Marker({
        position: polyline_coords[end_len],
        map: map,
        title: "End of trip"
    });
}

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
var speedScale = d3.scale.linear()
    .range([height, 0]);
speedScale.ticks(10);
var elevationScale = d3.scale.linear()
    .range([height, 0]);
elevationScale.ticks(10);
var SOCSScale = d3.scale.linear()
    .range([height, 0]);
SOCSScale.ticks(10);   
var gasScale = d3.scale.linear()
    .range([height, 0]);
gasScale.ticks(10);      

// a color scale for all the series
var color = d3.scale.category10();
            
// the proper xAxis based on the scale
var xAxis = d3.svg.axis()
    .ticks(10)
    .scale(xScale) 
    .orient("bottom");

// the proper y axis based on the scale
var speedAxis = d3.svg.axis()
    .ticks(5)
    .scale(speedScale)
    .orient("left");
var elevationAxis = d3.svg.axis()
    .ticks(5)
    .scale(elevationScale)
    .orient("right");
var SOCAxis = d3.svg.axis()
    .ticks(5)
    .scale(SOCSScale)   
    .orient("left");
var gasAxis = d3.svg.axis()
    .ticks(5)
    .scale(gasScale)   
    .orient("right");

// Create a brush to zoom in on the graph
var brush = d3.svg.brush()
    .x(xScale)
    .on("brushend", brushend);

// the line object that will be used
var lineSpeed = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return speedScale(d.data); });
var lineElevation = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return elevationScale(d.data); });
var lineSOC = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return SOCSScale(d.data); });
var lineGas = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.time); })
    .y(function(d) { return gasScale(d.data); });
var lines = {'speed': lineSpeed, 'altitude': lineElevation, 'SOC': lineSOC, 'gas': lineGas};

// Graph with speed and altitude
var svgSpeed = d3.select("#graph1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Graph with SOC and gas
var svgConsumption = d3.select("#graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// All the data is imported: speed, altitude, SOC, gas


// Append axis and labels for the first graph
svgSpeed.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

svgSpeed.append("g")
    .attr("class", "ySpeed")
    .call(speedAxis)
    .append("g")
    .attr("transform", "translate(-60, 0)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Speed (mph)");

svgSpeed.append("g")
    .attr("class", "yAltitude")
    .attr("transform", "translate(" + String(width) + ", 0)")
    .call(elevationAxis)
    .append("g")
    .attr("transform", "translate(-30, -10)") 
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Altitude (m)");

// Append the brush
svgSpeed.append("g")
    .attr("class", "brush")
    .call(brush)
  .selectAll('rect')
    .attr('height', height);

// Append a clip to mask the curve outside of bonderies
svgSpeed.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);


// Append axis and labels for the second graph
svgConsumption.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

svgConsumption.append("g")
    .attr("class", "ySOC")
    .call(SOCAxis)
    .append("g")
    .attr("transform", "translate(-60, -10)")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("State of charge (%)");

svgConsumption.append("g")
    .attr("class", "yGas")
    .attr("transform", "translate(" + String(width) + ", 0)")
    .call(gasAxis)
    .append("g")
    .attr("transform", "translate(-30, -10)") 
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Gas consumption (gal)");

// Append the brush
svgConsumption.append("g")
    .attr("class", "brush")
    .call(brush)
  .selectAll('rect')
    .attr('height', height);

// Append a clip to mask the curve outside of bonderies
svgConsumption.append("defs").append("clipPath")
    .attr("id", "clip2")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

// hold paths
var speedGroup;
var consumptiongroup;

// Add some variables to the data (name and visible)
speed = add_data1("speed", 0, speed);
altitude = add_data1("altitude", 1, altitude);
SOC = add_data2("SOC", 0, SOC);
gas = add_data2("gas", SOC.length, gas);

colorStart = SOC.length + gas.length;

gas = gas.concat(PHEV.map(function(d, i) {
    var newD = {}
    newD['fullName'] = d['name'];
    newD['name'] = 'phev' + i;
    newD['color'] = color(colorStart + i);
    newD['visible'] = true;
    newD['values'] = d['values'].map(function(val) {
        return {
            'time': parseDate(val['time']),
            'data': val['gas']
        };
    });
    newD['type'] = 'gas';
    return newD;
}));

SOC = SOC.concat(PHEV.map(function(d, i) {
    var newD = {}
    newD['fullName'] = d['name'];
    newD['name'] = 'phev' + i;
    newD['color'] = color(colorStart + i);
    newD['visible'] = true;
    newD['values'] = d['values'].map(function(val) {
        return {
            'time': parseDate(val['time']),
            'data': val['SOC']
        };
    });
    newD['type'] = 'SOC';
    return newD;
}));


// Scale the x axis with min and max time values
xScale.domain(d3.extent(speed[0].values, function(d) { return d.time; }));
reset_axis();

// Draw each curve and add the legend
draw_curve1(speed, speedScale, lineSpeed);
draw_curve1(altitude, elevationScale, lineElevation);
draw_curve2(SOC, SOCSScale, lineSOC);
draw_curve2(gas, gasScale, lineGas);
reset_y_axis();

// Draw legend
draw_legend1();
draw_legend2();


function draw_legend1() {
  var legendSpace = 50; // 450/number of issues (ex. 40)   
  var legende1 = d3.select("#graph1").selectAll(".speedGroup")
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

  d3.select("#graph1").selectAll(".speedGroup")
      .append("text")
      .attr("x", width + 50 + 40) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 40; })
      .text(function(d) { return d.name; });
}

function draw_legend2() {
  // make sure PHEV does not show up twice in the data, beacuse they are in both gas and SOC
  var allData = d3.select('#graph2').selectAll('.consumptiongroup').data();
  var usedNames = [];
  var legendData = allData.filter(function(d) {
    var found = usedNames.indexOf(d.name) === -1;  
    usedNames.push(d.name);
    return found;
  });

  var legendSpace = 50; // 450/number of issues (ex. 40)   
  var legende2 = d3.select("#graph2").selectAll(".consumptiongroup")
      .data(legendData)
      .append("rect")
      .attr("class", 'myRect') 
      .attr('name', function(d) {return d.name;})
      .attr("width", 30)
      .attr("height", 15)                                    
      .attr("x", width + 50) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 50; })  // spacing
      .attr("fill",function(d) {
          return d.visible ? d.color : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
      })
      .attr("class", "legend-box")
      .attr("stroke", "#000000")
      .on("click", function(d, i){
          // Toggle
          var prevVis = $('.' + this.getAttribute('name') + ' .line').attr('visibility');
          d3.selectAll('.' + this.getAttribute('name') + ' .line')
            .attr('visibility', function() {
                if (!prevVis || prevVis === 'visible') {
                    return 'hidden';
                }
                return 'visible';
            }) 
          d.visible = !d.visible;
          
          // Toggle color in legend
          legende2.transition()
            .attr("fill", function(d) {
            return d.visible ? d.color : "#F1F1F2";
          });  
      });

  d3.select("#graph2").selectAll(".consumptiongroup")
      .data(legendData)
      .append("text")
      .attr("x", width + 50 + 40) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 40; })
      .text(function(d) { return d.fullName; });
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
  if (name.indexOf("SOC") > -1){
    fullNameList = EV;
  }
  else {
    fullNameList = CV;
  }

  var newData = [];
  for (i=0; i<data.length; i++){
    // convert string to datetime
    data[i].forEach(function(d) {
      d.time = parseDate(d.time)
    });

    // Create a new structure
    newData.push({

      name: name + String(i),
      fullName: fullNameList[i],
      values: data[i],
      color: color(colorIndex+i),
      visible: true,

    });
  }
  return newData;
}

function draw_curve1(data, yScale, line){

  // Scale the y axis for speed, elevation and SOC
  yScale.domain([ d3.min(data[0].values, function(d) { return d.data;}),
                  d3.max(data[0].values, function(d) { return d.data;})]);

  // select all locations and bound group to non existant location
  speedGroup = svgSpeed.selectAll(".dsfgagrge")
                  .data(data)
                  .enter().append("g")
                  .attr("class", "speedGroup");

  speedGroup.append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr("d", function(d) { return d.visible ? line(d.values): null;})
      .style("stroke", function(d) { return d.color; });

}


function draw_curve2(data, yScale, line){
  // Find min and max
  var minTemp = [];
  var maxTemp = [];
  for (i=0; i<data.length; i++){
    minTemp.push(d3.min(data[i].values, function(d) { return d.data;}))
    maxTemp.push(d3.max(data[i].values, function(d) { return d.data;}))
  }
  min = d3.min(minTemp);
  max = d3.max(maxTemp);

  // Scale the y axis for speed, elevation and SOC
  yScale.domain([min, max]);

  // select all locations and bound group to non existant location
  consumptiongroup = svgConsumption.selectAll(".kjdfgagdsfsrge")
                  .data(data)
                  .enter().append("g")
                  .attr("class", function(d) {
                    var cls = "consumptiongroup " + d.name;
                    return cls
                  });

  consumptiongroup.append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr("d", function(d) { return d.visible ? line(d.values): null;})
      .style("stroke", function(d) { return d.color; });

}

function brushend() {
  get_button = d3.select(".clear-button");
  if(get_button.empty() === true) {
    clear_button = consumptiongroup.append('text')
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
    xScale.domain(d3.extent(speed[0].values, function(d) { return d.time; }));
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
    .attr("d", function(d, i) {
      var name = d.name;
      var category = "gas";
      if (name.indexOf('phev') !== -1 && d.type === 'SOC') {
        category = 'SOC';
      } 
      else if (name.indexOf("SOC") > -1) {
        category = "SOC";
      }
      return d.visible ? lines[category](d.values): null; });
    
}

function reset_axis() {
  svgSpeed.transition().duration(500)
   .select(".x.axis")
   .call(xAxis);

  svgConsumption.transition().duration(500)
   .select(".x.axis")
   .call(xAxis);
}

function reset_y_axis() {
  svgSpeed.transition().duration(500)
   .select(".ySpeed")
   .call(speedAxis);

  svgSpeed.transition().duration(500)
   .select(".yAltitude")
   .call(elevationAxis);

  svgConsumption.transition().duration(500)
   .select(".ySOC")
   .call(SOCAxis);

  svgConsumption.transition().duration(500)
   .select(".yGas")
   .call(gasAxis);
}


