function getTypes() {
    // composes a string of selected types
    selected = '';
    var firstAdded = true;
    // for each of the selected types, add their text to the string
    $('.car-type-box label').each(function() {
        if (this.firstChild.checked) {
            // add a comma before the textif its not the first selection
            if (!firstAdded) {
                selected += ',';
            }
            selected += this.textContent;
            firstAdded = false;
        }
    });
    return selected;
}

function value(el_selector) {
    // using the split-text attribute, cut the text to before the
    // list of types from that selection
    var el = $(el_selector + ' option:selected');
    if (!el.attr('split-text')) {
        return el.val()
    }
    return el.val().slice(0, parseInt(el.attr('split-text')));
}
// Get data for the drop list
function json_to_select(select_selector, needTypes) {
    var types = getTypes();
    if (types === '') {
        return;
    }
    $.ajax({
        //The URL to process the request
        'url': 'car_data/',
        //The type of request, also known as the "method" in HTML forms
        //Can be 'GET' or 'POST'
        'type': 'GET',
        //Any post-data/get-data parameters
        //This is optional
        'data': {
            'types': types,
            'year': value('#year'),
            'make': value('#make'),
            'car_model': value('#car_model'),
            'option': value('#option'),
            'fuel': value('#fuel'),
            'step': select_selector,
            'need_types': needTypes
        },
        //The response from the server
        'success': function(data) {
            var opt = $(select_selector);
            var old_val = opt.val();
            opt.html('');
            $.each(data, function() {
                // for each part of the data, add a new option element
                var optionEl = $('<option />');
                var text = this.value;
                if (this.value !== '------' && this.types) {
                    // if it's a real piece of data, add the split-text
                    // attribute to know where to cut the real data
                    // from the types description
                    optionEl.attr('split-text', text.length);
                    text += ' (' + this.types + ')';
                }
                optionEl.text(text);
                opt.append(optionEl);
            });
            opt.val(old_val);
            opt.change();
        }
    });
}

$(function() {
    var fields = $('#car-select select');
    fields.prop('disabled', true);
    fields.change(function(e) {
        // when the user changes the select boxes 
        if (!e.originalEvent) {
            return;
        }
        var selector = '#' + this.id;
        // clear all the select boxes below it
        fields.slice(fields.index(this) + 1).each(function(i, d) {
            $(d).empty();
            $(d).append($('<option />').text('------'));
        });
        // if a real selection was made, make an ajax request for
        // the next step
        if (this.value !== '------') {
            var nextInd = fields.index(this) + 1;
            if (nextInd < fields.length) {
                var needTypes = true;
                if ($('.car-type-box input:checked').length < 2) {
                    needTypes = false;
                } else {
                    // find out if types are needed on the next selection box
                    var select = fields[fields.index(this)];
                    var chosen = select.options[select.selectedIndex];
                    if ($(chosen).attr('split-text')) {
                        var currTypes = chosen.innerHTML.slice(parseInt($(chosen).attr('split-text')));
                        if (currTypes.indexOf(',') === -1) {
                            needTypes = false;
                        }
                    } else {
                        needTypes = false;
                    }
                }
                json_to_select('#' + fields[nextInd].id, needTypes);
                $("#" + fields[nextInd].id).prop('disabled', false);
            }
        }
    });
    // code to handle checkbox logic
    var allBox = $('.all-checkbox');
    var carTypeBox = $('.car-type-box input');
    // when "All" is changed, select all the car types if all is checked,
    // or deselect them all when unchecked
    allBox.change(function() {
        if (allBox.prop('checked')) {
            carTypeBox.prop('checked', true);
        } else {
            carTypeBox.prop('checked', false);
        }
        json_to_select('#year', $('.car-type-box input:checked').length > 1);
        $("#year").prop('disabled', false);
    });
    carTypeBox.change(function() {
        // if the box was deselected, deselect the all box
        if ($(this).prop('checked') === false) {
            allBox.prop('checked', false);
        }
        // otherwise, if all the car types are checked, select the all box
        else if ($('.car-type-box input:checked').length === carTypeBox.length) {
            allBox.prop('checked', true);
        }
        // when the selected car types are changed, clear all the select
        // boxes, and make an ajax request for the '#year' step
        fields.each(function() {
            $(this).empty();
            $(this).append($('<option />').text('------'));
        });
        // types are only needed if there are more than one checked car type
        json_to_select('#year', $('.car-type-box input:checked').length > 1);
        $("#year").prop('disabled', false);
    });
    // Add car to your personal reccord
    $('#add').click(function() {
        $("#add-car-alert").html("<strong>Success!</strong> We are currently simulating your new car <i>" + value("#year") + " " + value("#make") + " " + value("#car_model") + "</i>");
        $("#add-car-alert").removeClass("alert-success").addClass("alert-info");
        $("#add-car-alert").fadeIn(500).delay(5000).fadeOut(500);
        //Send the AJAX call to the server
        $.ajax({
            //The URL to process the request
            'url': 'save_car/',
            //The type of request, also known as the "method" in HTML forms
            //Can be 'GET' or 'POST'
            'type': 'GET',
            //Any post-data/get-data parameters
            //This is optional
            'data': {
                'year': value('#year'),
                'make': value('#make'),
                'car_model': value('#car_model'),
                'option': value('#option'),
                'fuel': value('#fuel')
            },
            //The response from the server
            'success': function(data) {
                location.reload();
                $("#add-car-alert").removeClass("alert-info").addClass("alert-success");
                $("#add-car-alert").html("<strong>Success!</strong> We have finished simulating your new car" + value("#year") + " " + value("#make") + " " + value("#car_model") + "</i>");
                $("#add-car-alert").fadeIn(500).delay(5000).fadeOut(500);
            }
        });
    });
    // Remove all car from your personal reccord
    $('#remove').click(function() {
        $("#add-car-alert").html("<strong>Success!</strong> We are removing all your vehicle simulation data.");
        $("#add-car-alert").removeClass("alert-success").addClass("alert-info");
        $("#add-car-alert").fadeIn(500).delay(5000).fadeOut(500);
        //Send the AJAX call to the server
        $.ajax({
            //The URL to process the request
            'url': 'remove_car/',
            //The type of request, also known as the "method" in HTML forms
            //Can be 'GET' or 'POST'
            'type': 'GET',
            //The response from the server
            'success': function(data) {
                location.reload();
                $("#add-car-alert").removeClass("alert-info").addClass("alert-success");
                $("#add-car-alert").html("<strong>Success!</strong> We have removed all your cars. Please add new cars to simulate.");
                $("#add-car-alert").fadeIn(500).delay(5000).fadeOut(500);
            }
        });
    });

    $("#remove-single").submit(function(event) {
                $("#add-car-alert").removeClass("alert-success").addClass("alert-info");
                $("#add-car-alert").html("<strong>Success!</strong> We are removing the cars you selected. Please add new cars to simulate.");
                $("#add-car-alert").fadeIn(500).delay(5000).fadeOut(500);

    });
});

