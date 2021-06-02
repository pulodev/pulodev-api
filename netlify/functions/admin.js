const AdminDB = require('./database/AdminDB');
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

    
    const params = querystring.parse(event.body)
  	if (event.httpMethod === "PUT") { 
     if(segments[0] == 'verify') {
        const type = segments[1] 
     		return await handleUpdate(params.ids, type)
     }
   }

   if (event.httpMethod === "DELETE") {
      const type = segments[0] 
      return await handleDelete(params.ids, type)
   }
}

async function handleFilter(type) {
      let items = null
      if(type == 'contents') {
        let {data: contents, error} = await AdminDB.getDraft(type)
        items = contents
      }
      else {
        let {data: sources, error} = await AdminDB.getDraft(type)
        items = sources
      }
      
      return response(200, { data: items });
}


async function handleUpdate(ids, type) {
  //to handle single id
  let id_array = []
  let all_ids = id_array.concat(ids) 
  
  await AdminDB.updateStatusBulk(type, all_ids)

  return response(200, {msg: `${type} successfully published`});
}

async function handleDelete(ids, type) {
  //to handle single id
  let id_array = []
  let all_ids = id_array.concat(ids) 
  
  await AdminDB.deleteBulk(type, all_ids)

  return response(200, {msg: `${type} successfully deleted`});
}