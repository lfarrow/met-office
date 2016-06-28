"use strict";

/* Constants */
var baseUrl = 'http://datapoint.metoffice.gov.uk/public/data/',
	apiKey = '551f7572-56ec-4090-a97e-11ea833f57b4',
	weatherCode = {
		"0"		: "Clear night",
		"1"		: "Sunny day",
		"2"		: "Partly cloudy",
		"3"		: "Partly cloudy",
		"4"		: "Not used",
		"5"		: "Mist",
		"6"		: "Fog",
		"7"		: "Cloudy",
		"8"		: "Overcast",
		"9"		: "Light rain shower",
		"10"	: "Light rain shower",
		"11"	: "Drizzle",
		"12"	: "Light rain",
		"13"	: "Heavy rain shower",
		"14"	: "Heavy rain shower",
		"15"	: "Heavy rain",
		"16"	: "Sleet shower",
		"17"	: "Sleet shower",
		"18"	: "Sleet",
		"19"	: "Hail shower",
		"20"	: "Hail shower",
		"21"	: "Hail",
		"22"	: "Light snow shower",
		"23"	: "Light snow shower",
		"24"	: "Light snow",
		"25"	: "Heavy snow shower",
		"26"	: "Heavy snow shower",
		"27"	: "Heavy snow",
		"28"	: "Thunder shower",
		"29"	: "Thunder shower",
		"30"	: "Thunder"
	};

/* Elements */
var locationsElement = $("#location"),
	nameElement = $("#name"),
	dateTimeElement = $("#dateTime"),
	weatherElement = $("#weather"),
	temperatureElement = $("#temperature"),
	windElement = $("#wind"),
	formElement = $("#form");


/* Helper Functions */
function makeRequest(url, successCallback, errorCallback) {
	return $.ajax({
		url: baseUrl + url + '&key=' + apiKey,
		dataType: 'json',
		method: 'GET',
		success: successCallback,
		error: errorCallback
	});
};


/* Events */
formElement.submit(function(e) {
	if(locationsElement.val() != ''){
		makeRequest('val/wxobs/all/json/' + locationsElement.val() + '?res=hourly', function(weather) {
				try {
					// Current day and current weather are last elements in arrays therefore index = length - 1
					var currentDay = weather.SiteRep.DV.Location.Period[weather.SiteRep.DV.Location.Period.length - 1],
						currentWeather = currentDay.Rep[currentDay.Rep.length - 1],
						locationName = weather.SiteRep.DV.Location.name,
						dateTime = new Date(currentDay.value),
						definitions = weather.SiteRep.Wx.Param;

					// Change location name to all caps to first letter only capitalised
					locationName = locationName.toLowerCase();
					locationName = locationName.charAt(0).toUpperCase() + locationName.slice(1);

					// Add minutes onto current date, to get update time.
					dateTime.setMinutes(dateTime.getMinutes() + currentWeather.$);

					/* Display data on page */
					displayData(nameElement, locationName);
					displayData(dateTimeElement, dateTime.toLocaleString());
					displayData(weatherElement, weatherCode[currentWeather.W]);
					displayData(temperatureElement, currentWeather.T + '&deg;C');
					displayData(windElement, currentWeather.S + 'mph (' + currentWeather.D + ')');
				}
				catch(error) {
					/* Display red error message, using selected location name from drop-down */
					displayData(nameElement, '<span style="color:red">Error retrieving weather data from ' + $("#location option:selected").text() + "</span>");
					
					/* Display "no data available messages " */
					displayData(dateTimeElement, undefined);
					displayData(weatherElement, undefined);
					displayData(temperatureElement, undefined);
					displayData(windElement, undefined);
				}
			}
		);
	}
	
});

/* Functions */
function getLocationList() {
	makeRequest('val/wxobs/all/json/sitelist?', function(location) {
			/* Pick out data from object */
			location = location.Locations.Location;

			/* Sort locations alphabetically */
			location.sort(function(a, b) {
			    var nameA = a.name.toLowerCase(),
			    	nameB = b.name.toLowerCase();
			    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
			});

			/* Loop through locations and append to locations dropdown */
			$.each(location, function() {
			    locationsElement.append($("<option />").val(this.id).text(this.name));
			});
		}
	);
}

function displayData(elementName, value) {
	if(value != undefined) {
		//.html() rather than .text() as it allows HTML entities to be used
		elementName.html(value);
	}
	else {
		elementName.html("No data available!");
	}
}



/* Initialise App */
function init() {
	getLocationList();
}
init();