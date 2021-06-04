const ContentDB = require('./database/ContentDB');
const querystring = require('querystring');
const { validateInput } = require('./utils/validate');
const { getRequestPath, stripLink, response } = require('./utils/helper');

exports.handler = async function(event, context, callback) {
    const {path, segments} = getRequestPath(event)
    const urlParams = event.queryStringParameters

    if (event.httpMethod === "GET") {
        if (segments.length === 0) {
            //no search or filter
            if(Object.keys(urlParams).length == 0)
                return handleGet()  //Route:: Get All

            //With search filter
            const _searchQuery = (urlParams.query != undefined) ? urlParams.query  : ''
            const _page = (urlParams.page != undefined) ? urlParams.page  : 1
            const _media = (urlParams.media != undefined) ? urlParams.media  : '*'
            
            return handleGet(_searchQuery, _media, _page)   
        }
         
         //Route:: Get single
        if (segments.length === 1) {
            return handleShow(segments[0]) //slug
        }
    }

   //Data preparation for POST request
   const params = JSON.parse(event.body)
   const rules =  { 
                    title: 'required|minLength:5', 
                    body: 'required|minLength:5',
                    url: 'required|url',
                    media: 'required|in:tulisan,web,tool,podcast,video' 
                  }

    if (event.httpMethod === "POST") {
        const _content = params.content
        validateInput(callback, _content, rules)
        return await handlePost(_content)
    }
}

//Get all contents
async function handleGet(_searchQuery = '',  _media = '*', _page = 1) {
    const {data: contents, count, err} = await ContentDB.index(_searchQuery, _media, _page)
    
    if (err) console.log('error', err)
          
    return response(200, {
           data: contents, 
           total: count
        })
}

//Submit Content
async function handlePost(_content) {
    const strippedUrl = stripLink(_content.url)
    const {data: prevContent, _err} = await ContentDB.containsUrl(strippedUrl)
    
    if (prevContent.length != 0) 
        return response(400, {
            errors: 'Maaf.. Link ini sudah ada di PuloDev, tidak perlu submit lagi :)' 
        })
    
    //insert if new
    const {content, error} = await ContentDB.store(_content)
    if(error) 
         return response(405, {
            errors: error
        })

    return response(200, {
             message: 'content submitted'
        })
}