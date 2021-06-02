const ContentDB = require('./database/ContentDB');
const SourceDB = require('./database/SourceDB');
const querystring = require('querystring');
const { getRequestPath, response, resCallback } = require('./utils/helper');

//ADMIN PAGE
exports.handler = async (event, context, callback) => {
    const {path, segments} = getRequestPath(event)
    const queryParameter = event.queryStringParameters

    if (event.httpMethod === "GET") {
          //Route:: Filter unpublished for admin to verify first.
          if (queryParameter.draft != undefined) 
                return await handleFilter(queryParameter.draft)
    }

    
  	if (event.httpMethod === "PUT") { 
     const params = querystring.parse(event.body)
     //link/verify/contents	|| sources
     if(segments[0] == 'verify') {
        const type = segments[1] 
        console.log(params.ids)
     		return await handleUpdate(params.ids, type)
     }
   }
}

async function handleFilter(type) {
      let items = null
      if(type == 'contents') {
        let {data: contents, error} = await ContentDB.getDraft()
        items = contents
      }
      else {
        let {data: sources, error} = await SourceDB.getDraft()
        items = sources
      }
      
      return response(200, { data: items });
}


async function handleUpdate(ids, type) {
  //to handle single id
  let id_array = []
  let all_ids = id_array.concat(ids) 
  
  if(type == 'contents') 
	 await ContentDB.updateStatusBulk(all_ids)
  else 
    await SourceDB.updateStatusBulk(all_ids)

  return response(200, {msg: `${type} successfully published`});
}