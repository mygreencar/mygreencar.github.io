// The same values should be used on the trips.html page
var red = '#d35400';
var green = '#27ae60';

// helpful for date formattiing
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Setting up data for the three "Car by Car Comparison" plots

// Define margins
var chartWidth = 960,
    barHeight = 50;

simulating.forEach(function(self) {
    data.push({
        'car_type': self['name'],
        'simulating': true
    });
});

// sort the data by its mpg, pushing simulating to the end
data.sort(function(a, b) {
    if (a['simulating']) {
        return 1;
    }
    if (b['simulating']) {
        return -1;
    }
    return +b['mpg'] - +a['mpg'];
});

//Set up margins
var barsHeight = barHeight * data.length;
var margin = {top: 40, right: 150, bottom: 40, left: 200, titleBottom: "-1em"},
width = Math.min(700, $('.col-xs-12').width()) - margin.left - margin.right,
height = barsHeight;

// Set up scales
var mpgyScale = d3.scale.ordinal()
    .domain(data.map(function(car) {
        return car['car_type'];
    }))
    .rangePoints([0, height - barHeight + 5]);

var mpgColorDomain = d3.extent(data, function(d) {
  return parseFloat(d['mpg']); 
});
var mpgDomain = [0, mpgColorDomain[1]];

var mpgxScale = d3.scale.linear()
.domain(mpgDomain)
.range([0, width]);

// Relative color scale (Other charts also use relative scales)
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

// Begin MPG plot
var mpgChart = d3.select("#mpg-summary")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var mpgBar = mpgChart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + mpgyScale(d['car_type']) + ")";  });

mpgBar.append("rect")
    .attr("width", function(d) {
        if (d['simulating']) {
            return 0;
        }
        return mpgxScale(parseFloat(d['mpg']));
    })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        if (d['simulating']) {
            return 'white'
        }
        return mpgColorScale(d['mpg']);
    });

// Append in-bar text
mpgBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) {
        if (d['simulating']) {
            return 'Currently simulating...'
        }
        if (d['mpg'] >= 200) {
            return 'Infinite MPG';
        }
        return parseFloat(d['mpg']).toFixed(1).toString() + " MPG";
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
mpgChart.append("g")
    .attr("class", "y axis")
    .call(mpgyAxis)
    .attr('stroke-width', '0px')
    .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
    .call(adjustTextLabels)

// Append title
mpgChart.append("text")
    .attr("x", (margin.left + width + margin.right) / 2)             
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Total Average Trip MPG");

// Begin co2 plot
// Set up scales
data.sort(function(a, b) {
    if (a['simulating']) {
        return 1;
    }
    if (b['simulating']) {
        return -1;
    }
    return +a['balloons'] - +b['balloons'];
});

var co2yScale = d3.scale.ordinal()
    .domain(data.map(function(d) {
        return d['car_type'];
    }))
    .rangePoints([0, height - barHeight + 5]);

var co2ColorDomain = d3.extent(data, function(d) { return parseFloat(d['balloons']); });
var co2Domain = [0, co2ColorDomain[1]];

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
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + co2yScale(d['car_type']) + ")";  });

co2Bar.append("rect")
    .attr("width", function(d) {
        if (d['simulating']) {
            return 0;
        }
        return co2xScale(parseFloat(d['balloons']));
    })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        return co2ColorScale(d['balloons']);
    });

// Append in-bar text
co2Bar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) {
        if (d['simulating']) {
            return 'Currently simulating...';
        }
        return (parseFloat(d['co2']).toFixed(0).toString() + " lbs-CO2");
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

appendCO2Text('balloons');

// Append axes
co2Chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
    .call(co2yAxis)
    .attr('stroke-width', '0px')
    .call(adjustTextLabels);

// Append title
co2Chart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2) 
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Total Annual CO2 Emissions");        

$('#co2').change(function() {
      var value = $(this).val();
      appendCO2Text(value, true);
});

function appendCO2Text(units, exists) {
    var accuracy = units === 'tree-years' ? 1 : 0;
    co2Chart.selectAll('.bar-text').remove();
    co2Chart.selectAll('.bar-text')
        .data(data)
        .enter()
        .append('text')
        .attr("x", 0)
        .attr("y", function(d) {
            return co2yScale(d['car_type']) + barHeight / 2
        })
        .attr("dy", ".5em")
        .attr("dx", "1em" )
        .attr("class", "bar-text")
        .text(function(d) {
          console.log('adding text')
            if (d['simulating']) {
                return 'Currently simulating...';
            } 
            return (parseFloat(d[units]).toFixed(accuracy).toString() 
                + ' ' + units);
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

// Begin cost plot
// Set up scales
data.sort(function(a, b) {
    if (a['simulating']) {
        return 1;
    }
    if (b['simulating']) {
        return -1;
    }
    return +a['fuel_cost'] - +b['fuel_cost'];
});

var costyScale = d3.scale.ordinal()
    .domain(data.map(function(car) {
        return car['car_type'];
    }))
    .rangePoints([0, height - barHeight + 5]);

var costColorDomain = d3.extent(data, function(d) { return parseFloat(d['fuel_cost']); });
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
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + costyScale(d['car_type']) + ")";  });

costBar.append("rect")
    .attr("width", function(d) {
        if (d['simulating']) {
            return 0;
        }
        return costxScale(parseFloat(d['fuel_cost'])); })
    .attr("height", barHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", function(d) {
        if (d['simulating']) {
            return 'white';
        }
        return costColorScale(d['fuel_cost']);
    });

// Append in-bar text
costBar.append("text")
    .attr("x", 0 )
    .attr("y", barHeight / 2)
    .attr("dy", ".5em")
    .attr("dx", "1em" )
    .attr("class", "bar-text")
    .text(function(d) {
        if (d['simulating']) {
            return 'Currently simulating...';
        }
        return "$" + parseFloat(d['fuel_cost']).toFixed(0).toString(); 
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
costChart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ margin.left +"," + parseInt(margin.top) + ")")
    .call(costyAxis)
    .attr('stroke-width', '0px')
    .call(adjustTextLabels);

// Append title
costChart.append("text")
    .attr("x", (margin.left + margin.right + width) / 2)
    .attr("y", margin.top)
    .attr("dy", margin.titleBottom)
    .attr("text-anchor", "middle")  
    .attr("class", "chart-title")
    .text("Total Annual Fuel Cost");   

// Begin trip plot selector

// Create the svg element
var tripMargin = {top: 50, right: 30, bottom: 50, left: 75};
var tripWidth = 800 - tripMargin.left - tripMargin.right;
var tripHeight = 500 - tripMargin.top - tripMargin.bottom;

var plotSVG = d3.select('.trip-plot-svg')
    .attr('width', tripWidth + tripMargin.left + tripMargin.right)
    .attr('height', tripHeight + tripMargin.top + tripMargin.bottom);

// display a maximum of 7 days at a time, disabling the left arrows as needed
var maxViewing = 7;
var rightMostDate = dates[dates.length - 1];
if (dates[0].getTime() >= rightMostDate.getTime() - timeToMs(24) * maxViewing) {
    $('.trip-plot-left, .trip-plot-far-left').addClass('disabled');
}

// yScale and yAxis
// Hours of the day to show on the y Axis
var tickVals = [0, 6, 12, 18];

var yScale = d3.scale.linear()
    .domain([timeToMs(24), 0])
    .range([tripHeight, 0]);

function formatTime(hrs, mins) {
    // helper function to return nicely formatted time from miltary hours:mins
    var hour = '';
    var ampm = '';
    if (hrs === 0 || hrs == 24) {
        hour = 12;
        ampm = 'AM';
    }
    else {
        hour = hrs > 12 ? hrs - 12 : hrs;
        ampm = hrs > 11 ? 'PM' : 'AM';
    }
    var min = (mins < 10 ? '0' : '') + mins;
    return hour + ':' + min + ' ' + ampm; 
}

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(tickVals.length)
    .tickValues(tickVals.map(function(i) {
        return timeToMs(i);
    }))
    .tickFormat(function(t, i) {
        return formatTime(tickVals[i], 0);
    });

plotSVG.append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', 'translate(' + tripMargin.left + ',' + tripMargin.top + ')')
    .call(yAxis);

function dateToString(date) {
  return date.toISOString().substr(0, 10);
}

$("#trip-timeline-date").datepicker({format: 'yyyy-mm-dd'});
$("#trip-timeline-date").datepicker('setEndDate', dateToString(rightMostDate));
$("#trip-timeline-date").datepicker('setStartDate', dateToString(dates[0]));
$("#trip-timeline-date").datepicker('update', dateToString(rightMostDate));

loadGraph(rightMostDate);
  
function loadGraph(endDate) {
    // updates the select boxes
    updateTripSelect(endDate);
    // loads the entire trip plot
    // refresh items include everything which needs to change as the user navigates,
    // such as x ticks and the visible circle points
    var plot = d3.select('.refresh-items');
    $('.refresh-items').empty();
    var currDates = [];
    for (var i = maxViewing - 1; i >= 0; i--) {
        var newDate = new Date(endDate.getTime() - timeToMs(24) * i);
        currDates.push(newDate);
    }
    currDates.unshift(' '); // a space at the beginning for padding
    // find all the points which are in the currect date range
    var currPoints = points.filter(function(point) {
        for (var i = 1; i < currDates.length; i++) {
            if (currDates[i].getTime() === point[0].getTime()) {
                return true;
            }
        }
        return false;
    });
    
    // xScale and xAxis
    // tick text is appended separately to give more freedom in formatting size
    var xScale = d3.scale.ordinal()
        .domain(currDates)
        .rangePoints([0, tripWidth]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        //.tickValues(xScale.domain())
        .orient('bottom')
        .ticks(currDates.length)
        .tickFormat('');

    plot.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(' + tripMargin.left + ',' + (tripMargin.top + tripHeight) + ')')
        .call(xAxis);

    // for all of the dates, append the text beneath the tick value 
    currDates.slice(1).forEach(function(d) {
        var dateString = d.toUTCString();
        // day of week
        plot.append('text')
            .attr('x', tripMargin.left + xScale(d))
            .attr('y', tripMargin.top + tripHeight + 25)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text(function() {
                return dateString.slice(0, 3);
            });
        // month + day
        plot.append('text')
            .attr('x', tripMargin.left + xScale(d))
            .attr('y', tripMargin.top + tripHeight + 43)
            .attr('font-size', '16px')
            .attr('class', 'date-tick')
            .attr('text-anchor', 'middle')
            .text(function() {
                // slice the UTC string to just include month + day
                return dateString.slice(8, 11) + ' ' + dateString.slice(5, 7);
            });
    });

    // draw the vertical gray lines
    currDates.forEach(function(d) {
        plot.append('line')
            .attr('stroke-dasharray', '4, 4')
            .attr('x1', tripMargin.left + xScale(d))
            .attr('x2', tripMargin.left + xScale(d))
            .attr('y1', tripMargin.top + tripHeight)
            .attr('y2', tripMargin.top)
            .attr('class', 'gray-line');
    });

    // draw the horizontal gray lines
    tickVals.forEach(function(d) {
        var lineHeight = tripMargin.top + yScale(timeToMs(d));
        plot.append('line')
            .attr('stroke-dasharray', '4, 4')
            .attr('x1', tripMargin.left)
            .attr('x2', tripMargin.left + tripWidth)
            .attr('y1', lineHeight)
            .attr('y2', lineHeight)
            .attr('class', 'gray-line'); 
    });

    // draw each of the points on the trip plot
    // each point is an <a> element with a circle child
    plot.selectAll('a')
        .data(currPoints)
        .enter()
        .append('a')
        .attr('xlink:href', function(d) {
            return '/greencar_app/profile/get/' + d[1] + '/';
        })
        .each(function(d) {
            // select the <a> and append a <circle>
            d3.select(this)
                .append('circle')
                .attr('cx', function(d) {
                    return tripMargin.left + xScale(d[0]);
                })
                .attr('cy', function(d) {
                    // points index 2 is the time in hours, mins
                    return tripMargin.top + yScale(timeToMs(d[2][0], d[2][1]))
                })
                .attr('r', function(d) {
                    return 10
                })
                .attr('class', 'trip-plot-point')
                .on('mouseover', function() {
                    d3.select(this).transition()
                        .duration('500')
                        .style('fill', '#27ae60');
                })
                .on('mouseout', function() {
                    d3.select(this).transition()
                        .duration('100')
                        .style('fill', '#d35400');
                })
                .on('click', function() {
                    $('.cssload-thecube').css('display', 'block');
                })
        });
}


function timeToMs(hours, mins, secs) {
    mins = mins || 0;
    secs = secs || 0;
    return hours * 3600000 + mins * 60000 + secs * 1000;
}

$('.trip-plot-far-left').click(function() {
    if ($('.trip-plot-left').hasClass('disabled')) {
        return;
    }
    $('.trip-plot-right').removeClass('disabled');
    $('.trip-plot-far-right').removeClass('disabled');
    rightMostDate = new Date(dates[0].getTime() + timeToMs(24) * (maxViewing - 1));
    loadGraph(rightMostDate);
    $(this).addClass('disabled');
    $('.trip-plot-left').addClass('disabled');
})


$('.trip-plot-left').click(function() { 
    if ($('.trip-plot-left').hasClass('disabled')) {
        return;
    }
    $('.trip-plot-right').removeClass('disabled');
    $('.trip-plot-far-right').removeClass('disabled');
    rightMostDate = new Date(rightMostDate.getTime() - timeToMs(24));
    loadGraph(rightMostDate);
    if (dates[0].getTime() >= rightMostDate.getTime() - timeToMs(24) * (maxViewing - 1)) {
        $(this).addClass('disabled');
        $('.trip-plot-far-left').addClass('disabled');
    }
})

$('.trip-plot-right').click(function() {
    if ($('.trip-plot-right').hasClass('disabled')) {
        return;
    }
    $('.trip-plot-left').removeClass('disabled');
    $('.trip-plot-far-left').removeClass('disabled');
    rightMostDate = new Date(rightMostDate.getTime() + timeToMs(24));
    loadGraph(rightMostDate);
    if (rightMostDate.getTime() === dates[dates.length - 1].getTime()) {
        $(this).addClass('disabled');
        $('.trip-plot-far-right').addClass('disabled');
    }
})

$('.trip-plot-far-right').click(function() {
    if ($('.trip-plot-right').hasClass('disabled')) {
        return;
    }
    $('.trip-plot-left').removeClass('disabled');
    $('.trip-plot-far-left').removeClass('disabled');
    rightMostDate = new Date(dates[dates.length - 1].getTime());
    loadGraph(rightMostDate);
    $(this).addClass('disabled');
    $('.trip-plot-right').addClass('disabled');
})

$("#trip-timeline-date").datepicker().on('changeDate', function(ev) {
    rightMostDate = ev.date;
    loadGraph(rightMostDate);
});

function updateTripSelect(date) {
    $("#trip-timeline-date").datepicker('update', dateToString(date));
    if (rightMostDate.getTime() === dates[dates.length - 1].getTime()) {
        $('.trip-plot-far-right').addClass('disabled');
        $('.trip-plot-right').addClass('disabled');
    } else if (rightMostDate.getTime() === dates[0].getTime()) {
        $('.trip-plot-far-left').addClass('disabled');
        $('.trip-plot-left').addClass('disabled');
    } else {
        $('.trip-plot-far-right').removeClass('disabled');
        $('.trip-plot-right').removeClass('disabled');
    }
}

$('.trips .panel-collapse a').click(function(e) {
    $('.cssload-thecube').css('display', 'block');
});

// Begin SOC/miles timeline
// note that everything is named "miles" because the plot was orinally for
// simply miles remaining, but we changed it to SOC.
// We hope to add a toggle between SOC and miles remaining

// d3's ordinal colors
var color = d3.scale.category10();

// run through the cars, finding the max miles remaining (for use in the y scale)
// as well as converting the string dates to Date objects
var maxMiles = 0;
Object.keys(milesData).forEach(function(car, i) {
    milesData[car].forEach(function(point) {
        maxMiles = Math.max(maxMiles, point[1]);
        point[0] = new Date(point[0] + '+00:00');
    });
});

// ensure there is actually data to plot
if (Object.keys(milesData).length !== 0) {
    // Create the svg element - follows the d3 margin convention:
    // https://bl.ocks.org/mbostock/3019563
    var milesMargin = {top: 40, right: 30, bottom: 30, left: 75};
    var milesWidth = 600 - milesMargin.left - milesMargin.right;
    var milesHeight = 400 - milesMargin.top - milesMargin.bottom;
    
    var milesSVG = d3.select('.miles-timeline')
        .attr('width', milesWidth + milesMargin.left + milesMargin.right)
        .attr('height', milesHeight + milesMargin.top + milesMargin.bottom)
        .append('g')
        .attr('transform', 'translate(' + milesMargin.left + ',' + milesMargin.top + ')');

    // Title and axis titles
    d3.select('.miles-timeline')
        .append('text')
        .attr('class', 'chart-title')
        .attr('x', milesMargin.left + milesWidth / 2)
        .attr('y', 20)
        .text('State of Charge')
        .attr('text-anchor', 'middle');

    // Add the y axis title, rotated -90 degrees
    var milesAxisX = 20;
    var milesAxisY = milesMargin.top + milesHeight / 2;
    d3.select('.miles-timeline')
        .append('text')
        .attr('class', 'miles-y-axis')
        .attr('y', milesAxisY)
        .attr('x', milesAxisX) 
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90,' + milesAxisX + ',' + milesAxisY + ')')
        .attr('text-anchor', 'middle')
        .text('State of Charge');

    // include a blank rectangle to make d3's zoom work over empty graph areas
    milesSVG.append('rect')
        .attr('width', milesWidth)
        .attr('height', milesHeight)
        .attr('fill', 'white');

    // clip path to hide overhanging lines
    milesSVG.append('clipPath')
        .attr('id', 'miles-clip')
        .append('rect')
        .attr('width', milesWidth + 2)
        .attr('height', milesHeight);

    var tmpArr = milesData[Object.keys(milesData)[0]];
    var dateMin = tmpArr[tmpArr.length - 1][0];
    var dateMax = tmpArr[0][0]; 
    var milesXScale = d3.time.scale.utc()
        .range([0, milesWidth])
        .domain([dateMin, dateMax]);
    var milesYScale = d3.scale.linear()
        .range([milesHeight, 0])
        .domain([0, maxMiles]);

    var milesXAxis = d3.svg.axis()
        .scale(milesXScale)
        .orient('bottom')
        .ticks(5)
        .tickFormat(timeTickFormat);

    var milesYAxis = d3.svg.axis()
        .scale(milesYScale)
        .orient('left')
        .tickFormat(function(d) {
            return d * 100 + '%';
        });

    milesSVG.append('g')
        .attr('class', 'axis miles-x-axis')
        .attr('transform', 'translate(0,' + milesHeight +')')
        .call(milesXAxis);
    
    redrawTickText();
    milesSVG.append('g')
        .attr('class', 'axis miles-y-axis')
        .call(milesYAxis);

    var line = d3.svg.line()
        //.interpolate('basis')
        .x(function(d) {
            return milesXScale(d[0]);
        })
        .y(function(d) {
            return milesYScale(d[1]);
        });

    // set the max zoom to only be able to zoom in to a 5 min span
    // scale = ((last date) - (first date)) / (5 mins as ms)
    var maxZoom = (tmpArr[0][0] - tmpArr[tmpArr.length - 1][0])
        / timeToMs(0, 5);
    var zoom = d3.behavior.zoom()
        .x(milesXScale)
        .scaleExtent([1, maxZoom])
        .on('zoom', function(d) {
            var trans = zoom.translate();

            // ensure the line does not go too far right
            var newX = Math.min(trans[0], 0);
            // ensure graph does not go too far left
            // rightmost point should never be at a position less than width
            if (milesXScale(tmpArr[0][0]) < milesWidth) {
                newX += milesWidth - milesXScale(tmpArr[0][0])
            }
            zoom.translate([newX, trans[1]]);

            // redraw the lines and the x axis 
            milesSVG.selectAll('.miles-line')
                .attr('d', line);
            milesSVG.select('.miles-x-axis').call(milesXAxis);
            redrawTickText();
        });

    // add the zoom behavior to the milesSVG
    milesSVG.call(zoom);
    
    // append each of the lines
    Object.keys(milesData).forEach(function(car, i) {
        var lineData = milesData[car];
        milesSVG.append('g')
            .datum(lineData)
            .append('path')
            .attr('class', 'line miles-line ' + 'car-' + car)
            .attr('d', line)
            .style('clip-path', 'url(#miles-clip)')
            .style('stroke', color(car));
    });

    // miles timeline legend - shared with the min miles per day plot
    
    var legendSpace = 50;

    // Create the svg element
    var legendMargin = {top: 30, right: 20, bottom: 30, left: 20};
    var legendWidth = 200 - legendMargin.left - legendMargin.right;
    var legendHeight = 400 - legendMargin.top - legendMargin.bottom;

    var milesTimelineEl = $('.miles-timeline')
    var legendSVG = d3.select('.miles-legend')
        .attr('width', legendWidth + legendMargin.left + legendMargin.right)
        .attr('height', legendHeight + legendMargin.top + legendMargin.bottom)
        .style('position', 'absolute')
        .style('top', milesTimelineEl.offset().top)
        .style('left', milesTimelineEl.offset().left + milesTimelineEl.width())
        .append('g')
        .attr('transform', 'translate(' + legendMargin.left + ',' + legendMargin.top + ')');

    var rectWidth = 30;
    var rectHeight = 15;
    legendSVG.selectAll('rect')
        .data(Object.keys(milesData))
        .enter()
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('x', 0)
        .attr('y', function(d, i) {
            return legendSpace * i;
        })
        .attr('fill', function(car) {
            return color(car);
        })
        .attr('class', 'legend-box')
        .attr('stroke', '#000000')
        .on('click', function(car) {
            var lineAndBars = d3.selectAll('.car-' + car);
            var visible = lineAndBars.style('visibility') === 'visible';
            lineAndBars.style('visibility', visible ? 'hidden' : 'visible');
            d3.select(this)
                .style('fill', visible ? '#F1F1F2' : color(car));
        });

    legendSVG.selectAll('text')
        .data(Object.keys(milesData))
        .enter()
        .append('text')
        .attr('x', rectWidth + 10)
        .attr('y', function(d, i) {
            return legendSpace * i + rectHeight / 2;
        })
        .text(function(car) {
            return carNames[car];
        })
        .attr('dy', '0.4em'); // alternative to alignment-baseline: middle;

    // handles the positioning of the legend - a more elegant solution would be better
    $('.miles-legend').css({
        left: $('.miles-timeline').offset().left + $('.miles-timeline').width(),
        top: $('.miles-timeline').offset().top
    });

    $(window).resize(function() {
        $('.miles-legend').css({
            left: $('.miles-timeline').offset().left + $('.miles-timeline').width(),
            top: $('.miles-timeline').offset().top
        });
    });

    $(window).scroll(function() {
        var windowTop = $(window).scrollTop();
        var milesTop = $('.miles-timeline').offset().top;
        var minMiTop = $('.min-mi-timeline').offset().top;
        if (windowTop >= milesTop) {
            if (windowTop < minMiTop) {
                $('.miles-legend').css({
                    position: 'fixed',
                    top: '10px',
                });
            }
            else {
                $('.miles-legend').css({
                    position: 'absolute',
                    top: minMiTop
                });
            }
        }
        else {
            $('.miles-legend').css({
                position: 'absolute',
                top: milesTop
            });
        }
    });

}

function redrawTickText() {
    milesSVG.selectAll('.miles-x-axis .tick text')
        .style('font-size', function(d, i, x) {
            if (d.getUTCHours() === 0) {
                return '18px';
            }
            return '16px';
        });
}

// Min miles per day timeline - follows the same d3 margin convention as the
// miles/SOC timeline
var maxOfMinMi = 0;
Object.keys(minMi).forEach(function(car) {
    minMi[car]['dates'].forEach(function(pair) {
        maxOfMinMi = Math.max(maxOfMinMi, pair[1]);
        pair[0] = new Date(pair[0]);
    });
});

if (Object.keys(minMi).length !== 0) {
    // Create the svg element
    var minMiMargin = {top: 40, right: 30, bottom: 30, left: 75};
    var minMiWidth = 600 - minMiMargin.left - minMiMargin.right;
    var minMiHeight = 400 - minMiMargin.top - minMiMargin.bottom;

    // Title and axis titles
    d3.select('.min-mi-timeline')
        .append('text')
        .attr('class', 'chart-title')
        .attr('x', minMiMargin.left + minMiWidth / 2)
        .attr('y', 20)
        .text('Minimum State of Charge Per Day')
        .attr('text-anchor', 'middle');

    var minMiAxisX = 20;
    var minMiAxisY = minMiMargin.top + minMiHeight / 2;
    d3.select('.min-mi-timeline')
        .append('text')
        .attr('class', 'min-mi-y-axis-title')
        .attr('y', minMiAxisY)
        .attr('x', minMiAxisX) 
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90,' + minMiAxisX + ',' + minMiAxisY + ')')
        .attr('text-anchor', 'middle')
        .text('State of Charge');
 
    var minMiSVG = d3.select('.min-mi-timeline')
        .attr('width', minMiWidth + minMiMargin.left + minMiMargin.right)
        .attr('height', minMiHeight + minMiMargin.top + minMiMargin.bottom)
        .append('g')
        .attr('transform', 'translate(' + minMiMargin.left + ',' + minMiMargin.top + ')');

    minMiSVG.append('clipPath')
        .attr('id', 'min-miles-clip')
        .append('rect')
        .attr('width', minMiWidth)
        .attr('height', minMiHeight)

    var tmpMinMiArr = minMi[Object.keys(minMi)[0]]['dates'];
    var daysShown = Math.min(5, tmpMinMiArr.length);
    var minMiXScale = d3.time.scale.utc()
        .range([0, minMiWidth])
        .domain([tmpMinMiArr[tmpMinMiArr.length - 1][0], tmpMinMiArr[0][0]])

    var minMiYScale = d3.scale.linear()
        .range([minMiHeight, 0])
        .domain([0, maxOfMinMi]);
    
    var minMiXAxis = d3.svg.axis()
        .scale(minMiXScale)
        .orient('bottom')
        .ticks(5)
        .tickFormat(timeTickFormat);
    
    var leftDate = minMiXScale.invert(0);
    var rightDate = minMiXScale.invert(minMiWidth);
    if (rightDate - leftDate < timeToMs(24 * daysShown)) {
        minMiXAxis.ticks(d3.time.day.utc, 1);
    }
    else {
        minMiXAxis.ticks(daysShown);
    }

    var minMiYAxis = d3.svg.axis()
        .scale(minMiYScale)
        .orient('left')
        .tickFormat(function(d) {
            return d * 100 + '%';
        });

    minMiSVG.append('g')
        .attr('class', 'axis min-mi-x-axis')
        .attr('transform', 'translate(0,' + minMiHeight + ')')
        .call(minMiXAxis);

    minMiSVG.append('g')
        .attr('class', 'axis min-mi-y-axis')
        .call(minMiYAxis);

    // include a blank rectangle to make d3's zoom work over empty graph areas
    // delete the previously used cover
    minMiSVG.selectAll('.cover').remove();
    minMiSVG.append('rect')
        .attr('width', milesWidth)
        .attr('height', milesHeight)
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .attr('class', 'cover');

    // as with the miles remaining line graph, limit the max zoom to one day
    var maxZoom = (tmpMinMiArr[0][0] - tmpMinMiArr[tmpMinMiArr.length - 1][0])
        / timeToMs(24);
    // set initial zoom scale
    var minMiInitScale = (tmpMinMiArr[0][0] - tmpMinMiArr[tmpMinMiArr.length - 1][0])
        / timeToMs(daysShown * 24);
    var minMiZoom = d3.behavior.zoom()
        .x(minMiXScale)
        .scaleExtent([minMiInitScale, maxZoom])
        .on('zoom', function(d) {
            var barInformation = barInfo();
            var numCars = barInformation['numCars'];
            var barWidth = barInformation['barWidth'];
            var neededExtra = barInformation['neededExtra'];

            var trans = minMiZoom.translate();
            var newX = Math.min(trans[0], neededExtra);
            if (minMiXScale(tmpMinMiArr[0][0]) < minMiWidth - neededExtra) {
                newX += minMiWidth - minMiXScale(tmpMinMiArr[0][0]) - neededExtra;
            }
            minMiZoom.translate([newX, trans[1]]);
            minMiSVG.select('.min-mi-x-axis').call(minMiXAxis);
            var leftDate = minMiXScale.invert(0);
            var rightDate = minMiXScale.invert(minMiWidth);
            if (rightDate - leftDate < timeToMs(24 * daysShown)) {
                minMiXAxis.ticks(d3.time.day.utc, 1);
            }
            else {
                minMiXAxis.ticks(daysShown);
            }
            minMiSVG.selectAll('.min-miles-bar').remove();
            drawBars(numCars, barWidth);
        });

    d3.select('.min-mi-timeline').call(minMiZoom);

    minMiZoom.scale(minMiInitScale);

    var barInformation = barInfo();
    var numCars = barInformation['numCars'];
    var barWidth = barInformation['barWidth'];
    var neededExtra = barInformation['neededExtra'];

    var newX = -minMiXScale(tmpMinMiArr[0][0]) + minMiWidth - neededExtra;
    minMiZoom.translate([newX, minMiZoom.translate()[1]]);
    minMiSVG.select('.min-mi-x-axis').call(minMiXAxis);
   
    drawBars(numCars, barWidth);
}

drawBars(numCars, barWidth);

function drawBars(numCars, barWidth) {
    Object.keys(minMi).forEach(function(car, i) {
        minMiSVG.selectAll('.car-' + car)
            .data(minMi[car]['dates'])
            .enter()
            .insert('rect', ':first-child')
            .attr('class', 'min-miles-bar car-' + car)
            .attr('x', function(pair) {
                var loc = minMiXScale(pair[0]);
                // add an offset to make bars appear next to each other
                if (numCars % 2 == 0) {
                    loc += barWidth * (i - (numCars / 2));
                }
                else {
                    loc += barWidth * ((i - ((numCars - 1) / 2)) - 0.5); 
                }
                return loc;
            })
            .attr('y', function(pair) {
                return minMiYScale(pair[1]);
            })
            .attr('width', barWidth)
            .attr('height', function(pair) {
                return Math.max(0, minMiHeight - minMiYScale(pair[1]));
            })
            .attr('fill', color(car))
            .style('clip-path', 'url(#min-miles-clip)')
            .style('visibility', milesSVG.select('.car-' + car)
                .style('visibility'));
    });

}

function timeTickFormat(d) {
    if (d.getUTCHours() === 0) {
        return monthNames[d.getUTCMonth()] + ' ' + d.getUTCDate();
    }
    return formatTime(d.getUTCHours(), d.getUTCMinutes());
}

function barInfo() {
    var numCars = Object.keys(minMi).length;
    var oneDay = tmpMinMiArr[0][0];
    var anotherDay = new Date(oneDay.getTime() + timeToMs(24));
    var dayDist = minMiXScale(anotherDay) - minMiXScale(oneDay);
    var padding = Math.floor((0.2 * dayDist) / numCars);
    var barWidth = Math.floor(dayDist / numCars) - padding;
    var neededExtra = barWidth * (numCars / 2) + padding * numCars;
    return {
        numCars: numCars,
        barWidth: barWidth,
        neededExtra: neededExtra
    }
}

function sameDay(a, b) {
    return a.getYear() === b.getYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}
