
exports.getRequestPath = (event) => {
	const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
	const segments = path.split('/').filter(e => e)
	return { path, segments}
}

exports.stripLink = (url) => url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")

//Custom Response and Callback
 //to attach header on every request
const headers = {
        'Access-Control-Allow-Origin': '*', //change later to ur domain || localhost
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      };

exports.response = (statusCode, body) => 
	({
	    headers,
	    statusCode : statusCode,
	    body: JSON.stringify(body), 
	 })

 exports.resCallback = (statusCode, body, callback) =>
	 callback(null, {
	 		headers,
	        statusCode: statusCode,
	        body: JSON.stringify(body)
	    });