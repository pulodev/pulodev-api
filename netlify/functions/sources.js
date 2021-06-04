const SourceDB = require('./database/SourceDB');
const { validateInput } = require('./utils/validate');
const { getRequestPath, stripLink, response } = require('./utils/helper');

exports.handler = async function(event, context, callback) {
    const {path, segments} = getRequestPath(event)
    const queryParameter = event.queryStringParameters

   const params = JSON.parse(event.body)
   const rules =  { 
                    title: 'required', 
                    url: 'required|url',
                    media: 'required|in:tulisan,web,podcast,video' 
                  }

     if (event.httpMethod === "POST") {
        validateInput(callback, params.source, rules)
        return await handlePost(params.source)
   }
}

async function handlePost(source) {
    const strippedUrl = stripLink(source.url)
    const {data: prevContent, _err} = await SourceDB.containsUrl(strippedUrl)
    
    if (prevContent.length != 0) 
        return response(400, {errors: 'RSS ini sudah ada di PuloDev, terima kasih'})
    
    //insert if new
    const {content, error} = await SourceDB.store(source)
    if(error) 
        return response(405, {errors: error})

    return response(200, { message: 'source succesfully submitted'})
}
