/* Copied from the Github issue
Functionally, the map works. There are some cosmetic and UX things that should be changed.
TODO:
1. Change the size of the map to take up the whole screen or close to it. Be careful as Google Maps is picky with requiring a map's container to have a specified height.
2. Add a loading icon on save. Right now when a location is saved or forgotten, there is no indication of loading, and the buttons aren't disabled.
3. Allow a toggle on/off of forgotten locations.
4. Draw or find a better gray marker for forgotten locations than the current one.
5. Add a legend?
6. Style the form better? I think the forget location button could be a red X or something like that.
*/
var map = initMap();
function initMap() {
    // create bounds, which will extend to cover all location markers
    var bound = new google.maps.LatLngBounds();
    data.forEach(function(d) {
        bound.extend(d['latLng']);
    });
    var map = new google.maps.Map(document.getElementById('locations-map'), {
        // center the map at the center of all the markers
        // the style and control types are copied from the trips page map
        center: bound.getCenter(),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        panControl: true,
        scrollwheel: true,
        mapTypeControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },   
        scaleControl: true,
        streetViewControl: false,
        zoom: 1 // overridden with map.fitBounds below
    });   
    map.fitBounds(bound);
    var legend = document.getElementById('locations-map-legend');
    var icons = ["https://maps.google.com/mapfiles/ms/icons/red-dot.png", "https://maps.google.com/mapfiles/ms/icons/green-dot.png", "https://i.imgur.com/ahIMDaV.png"];
    var labels = ["New", "Saved", "Forgotten"];

    for (var i = 0; i < icons.length; i++) {
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icons[i] + '"> ' + labels[i];
      legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    return map; // return the map to be used later
}
var info = new google.maps.InfoWindow();
google.maps.event.addListener(map, "click", function(event) {
  info.close();
});
var forgottenlocations = new Set();
var newlocations = new Set();
var savedlocations = new Set();
data.forEach(drawMarker);

function createForm(d) {
    // generates the HTML form from the location's data
    var html = '<div class="location-form" id="' + d['id'] + '"><form>';
    html += '<table border="0">';
    // create the name input box
    html += '<tr><td><b>Name:</b></td>' + '<td><input name="name" type="text" placeholder="Name" class="name-input"';
    // add the value of the location's name if there is one
    if (d['name']) {
        html += ' value="' + d['name'] + '"';
    }
    html += '></td><tr>'
    // add the type of location selection box
    html += '<td><b>Type:</b></td>' + '<td><select autocomplete="off" class="type-input">';
    // add each of the possible choices
    typeChoices.forEach(function(type) {
        html += '<option ';
        // for the first "empty" choice, its value is nothing
        if (type[1] === '----') {
            html += 'value="" ';
            // if the user has not specified a type choice
            if (d['type'] === 'None') {
                html += 'selected="selected"'
            }
        }
        // otherwise fill the value with the type's value
        else {
            html += 'value="' + type[0] + '" ';
            // if the type is the same as the location's make it the selected
            // choice
            if (d['type'] === type[0]) {
                html += 'selected="selected"';
            }
        }
        html += '>' + type[1] + '</option>'
    });
    html += '</select></td></tr>';
    // generate the charging options similarly to the type options
    html += '<tr><td><b>Charging:</b></td>' + '<td><select autocomplete="off" class="charging-input">';
    chargingChoices.forEach(function(charging) {
        html += '<option ';
        if (charging[1] === '----') {
	    html += 'value="" '
            if (d['charging'] === null) {
                html += 'selected="selected"'
            }
        }
        else {
            html += 'value="' + charging[0] + '" ';
            if (parseInt(d['charging']) === charging[0]) {
                html += 'selected="selected"';
            }
        }
        html += '>' + charging[1] + '</option>'
    });
    html += '</select></td><tr>'
    // Input for electricity price
    html += '<tr><td><b>Electricity price:</b></td>' + '<td><input name="electricity_price" type="text" placeholder="0.152" class="electricity_price-input"';
    // add the value of the location's electricity price if there is one
    if (d['electricity_price']) {
        html += ' value="' + d['electricity_price'] + '"';
    }
    html += '></td><tr>'

    // create submit and forget location buttons
    html += '<td style="Vertical-align:top"><input type="checkbox" value="" class="location-forget"';
    if (d['forget'] === 1) {
      html += " checked";
    }
    html += '></td><td>Forget Location';
    html += '<input type="submit" value="Save" class="location-submit">'
    html += '</td></tr></table></form>';
    html += '</div>';
    return html
}

$('#locations-map').on('click', '.location-submit', function(e) {
    // don't "send" the form, instead use AJAX
    e.preventDefault();
    var toplevel = $(this).parent().parent().parent().parent().parent().parent();
    // disable the submit button
    $(this).prop('disabled', true);
    $(this).val("Calculating...");
    
    // get all the values
    var id = toplevel.attr('id');
    var name = toplevel.find('.name-input').val();
    var type_of_location = toplevel.find('.type-input').val();
    var chargingoption = toplevel.find('.charging-input').val();
    var electricity_price = toplevel.find('.electricity_price-input').val();
    var forget;
    if (toplevel.find('.location-forget').is(':checked'))
      forget = 1; 
    else
      forget = 0; 
    sendForm(id, name, type_of_location, chargingoption, forget, electricity_price);
});

function sendForm(id, name, type_of_location, chargingoption, forget, electricity_price) {
     $.ajax({
        method: 'POST',
        url: '/greencar_app/locations/',
        data: { 
            id: id,
            name: name,
            type_of_location: type_of_location,
            chargingoption: chargingoption,
            forget: forget,
            electricity_price: electricity_price
        },
        // beforeSend: function(xhr, settings) {
        //     xhr.setRequestHeader('X-CSRFToken', csrfToken);
        // }
    }).done(function() {
        // if it was successful, update our data object with the new data
        var locationData = data.filter(function(d) {
            return d['id'] === id;
        })[0];
        locationData['new'] = false;
        locationData['id'] = id;
        locationData['name'] = name;
        locationData['type'] = type_of_location;
        locationData['charging'] = chargingoption;
        locationData['forget'] = forget;
        // redraw the location's marker with updated data
        drawMarker(locationData);
        info = new google.maps.InfoWindow();
        console.log('success');
        // On success update, create the "SUCCESS" alert
        $("#update-locations").removeClass("alert-danger").html("");
        $("#update-locations").addClass("alert-success").html("<center><strong>Success!</strong> Your location <i>" + locationData['name'] + "</i> was updated.</center>");
        $("#update-locations").fadeIn(500).delay(5000).fadeOut(500);
    }).fail(function(data) {
        $("#update-locations").removeClass("alert-success").html("");
        $("#update-locations").addClass("alert-danger").html("<center><strong>Warning!</strong> Your location was not updated. Try filling out the complete form before submitting.</center>");
        $("#update-locations").fadeIn(500).delay(2000).fadeOut(500);
        info.close();
        info = new google.maps.InfoWindow();
        console.log('fail', data, id, name, type_of_location, chargingoption, forget, electricity_price);
    });
}



function drawMarker(d) {
    // delete the markers that already exist, if we are redrawing the location's marker
    if (d['circle']) {
        d['circle'].setMap(null);
    }
    if (d['marker']) {
        d['marker'].setMap(null);
    }
    var color = 'green';
    if (d['new']) {
        color = 'red';
    }
    else if (d['forget']) {
        color = 'gray';
    }
    // add a circle around the marker
    var circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        center: d['latLng'],
        radius: 100 
    });
    var markerOptions = {
        position: d['latLng'],
        map: map,
        title: d['name'],
    }
    if (!d['new']) {
        markerOptions['icon'] = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    }
    if (d['forget']) {
        markerOptions['icon'] = 'https://i.imgur.com/ahIMDaV.png';
    } 
    var marker = new google.maps.Marker(markerOptions);
    if (d['new']) {
      newlocations.add([marker, circle]);
      marker.setVisible($("#new-checkbox").is(":checked"));
    } else if (d['forget']) {
      forgottenlocations.add([marker, circle]);
      marker.setVisible($("#forgotten-checkbox").is(":checked"));
    } else {
      savedlocations.add([marker, circle]);
      marker.setVisible($("#saved-checkbox").is(":checked"));
    }
    
    var formcontent = createForm(d); 
    circle.addListener('click', function() {
      if (formcontent == info.content) {
        info.close(map, marker);
        info.content = "";
        return;
      }
      info.setContent(createForm(d));
      info.open(map, marker);
    });
    marker.addListener('click', function() {
      if (formcontent == info.content) {
        info.close(map, marker);
        info.content = "";
        return;
      } 
      info.setContent(createForm(d));
      info.open(map, marker);
    });
    // keep track of the marker and circle in the data object
    d['circle'] = circle;
    d['marker'] = marker;
}

$("#new-checkbox").click(function() {
  showhideLocations(newlocations, $("#new-checkbox").is(":checked"));
});

$("#saved-checkbox").click(function() {
  showhideLocations(savedlocations, $("#saved-checkbox").is(":checked"));
});

$("#forgotten-checkbox").click(function() {
  showhideLocations(forgottenlocations, $("#forgotten-checkbox").is(":checked"));
});

function showhideLocations(locations, isVisible) {
  locations.forEach(function(loc) {
    loc[0].setVisible(isVisible);
    loc[1].setVisible(isVisible);
  });
  info.close(); 
}

