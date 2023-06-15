try {
	var responseCode = parseInt(context.getVariable('response.status.code'));
	context.setVariable('validateResponseType.isValid',false);

	var myData = {
		org: context.getVariable('organization.name'),
		env: context.getVariable('environment.name'),
		responseCode: responseCode,
		isError: (responseCode >= 400)
	};

	if (myData.isError) {
		myData.errorMessage = context.getVariable('flow.error.message');
	}

	// var myDataRequest = new Request(
	// 		'https://loggly.com/aaa', 
	// 		'POST', 
	// 		{'Content-Type': 'application/json'}, 
	// 		JSON.stringify(myData)
	// );
	// httpClient.send(myDataRequest);

	var getDetails = new Request("http://10.21.180.112:4041/v1/organizations/testorg/userroles/admin/users",
	                             "GET", 
								 {'Authorization': 'basicAuth'});  
								   
    var detailReq = httpClient.send(getDetails);
} catch (e) {}