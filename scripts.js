/* Constants */
var baseUrl = 'http://datapoint.metoffice.gov.uk/public/data/',
	apiKey = '551f7572-56ec-4090-a97e-11ea833f57b4';

/* Elements */
var locationsElement = $("#location");

/* Helper Functions */
function makeRequest(url, successCallback, errorCallback) {
	return $.ajax({
		headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'text/plain'
	    },
		url: baseUrl + url + '&key=' + apiKey,
		dataType: 'json',
		method: 'GET',
		success: successCallback,
		error: errorCallback
	});
};


/* Functions */
function getLocationList() {
	makeRequest('val/wxfcs/all/json/sitelist?', function(location) {
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
		},
		function(data) {
			console.log(data);
		}
	);
}

/* Initialise App */
function init() {
	getLocationList();
}
init();