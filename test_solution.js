var http = require('http');
http.createServer(function (request, response) {
	// Only process the json data on post method
	 if (request.method === 'POST') {
	 	var body_data = [];

	 	// Receive the complete form raw data
	 	request.on('data', (chunk) => {
	 		//Append all the chunk data
		    body_data.push(chunk);
		 }).on('end', (body_content) => {
		 	// Decode the form data into string
		    var body_content =  Buffer.concat(body_data).toString();

		    // Convert string to json and if any error come then throw error by catch section
		    try {
		    	var json_data = JSON.parse(body_content);
		    	var required_data = json_data.payload;
		    	var final_response = [];

		    	// Loop and prepare final set of data 
		    	for(var i = 0; i < required_data.length; i++) {
		    		var each_final_data = {'concataddress' : '', 'type': '', 'workflow' : ''}

		    		//Concat the addresses
		    		each_final_data['concataddress'] = required_data[i]['address']['buildingNumber'] + " " + required_data[i]['address']['street'] + " " + required_data[i]['address']['suburb'] + " " + required_data[i]['address']['postcode'] + " " + required_data[i]['address']['state'];

                    each_final_data['type'] = required_data[i]['type'];
                    each_final_data['workflow'] = required_data[i]['workflow'];

                    // Append all the json data		    		
		    		final_response.push(each_final_data);
	    		}

	    		// Response the final json data
	    		var success_message = { "response": final_response};
    			response.write(JSON.stringify(success_message)); 
    			response.end();
			} catch (err){

				// Response the error message
    			var error_message = { "error": "Could not decode request: JSON parsing failed"};
    			response.write(JSON.stringify(error_message)); 
    			response.end();
			}
		  });        
    } else {
    	var error_message = { "error": "Invalid Method"};
    	response.write(JSON.stringify(error_message)); 
    	response.end();
    }
}).listen(8080);

