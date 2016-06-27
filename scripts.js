/* Constants */
var baseUrl = 'http://datapoint.metoffice.gov.uk/public/data/',
	apiKey = '551f7572-56ec-4090-a97e-11ea833f57b4';

/* Functions */
function makeRequest(url, successCallback, errorCallback) {
	return $.ajax({
		url: baseUrl + url + '&key=' + apiKey,
		dataType: 'json',
		method: 'GET',
		success: successCallback,
		error: errorCallback
	});
};