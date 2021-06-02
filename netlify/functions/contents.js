const ContentDB = require('./database/ContentDB');
const querystring = require('querystring');
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