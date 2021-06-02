const SourceDB = require('./database/SourceDB');
const querystring = require('querystring');
const { validateInput } = require('./utils/validate');
const { getRequestPath, stripLink, response } = require('./utils/helper');

exports.handler = async function(event, context, callback) {
    const {path, segments} = getRequestPath(event)
    const queryParameter = event.queryStringParameters

   const params = querystring.parse(event.body)
   const rules =  { 
                    title: 'required|minLength:5', 
                    url: 'required|url',
                    media: 'required|in:tulisan,web,podcast,video' 
                  }

     if (event.httpMethod === "POST") {
        validateInput(callback, params, rules)
        return await handlePost(params)
   }
}

async function handlePost(params, user_id) {
    const strippedUrl = stripLink(params.url)
    const {data: prevContent, _err} = await SourceDB.containsUrl(strippedUrl)
    
    if (prevContent.length != 0) 
        return response(400, {message: 'source is already exists'})
    
    //insert if new
    const {content, error} = await SourceDB.store(params)
    if(error) 
        return response(405, {errors: error})

    return response(200, { message: 'source succesfully submitted'})
}
