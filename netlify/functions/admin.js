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

          if(segments[0] == 'active-contents')
              return await getActiveContents()
    }

    const params = querystring.parse(event.body)

    //aggregator
    if (event.httpMethod === "POST") { 
      if(segments[0] == 'store' && segments[1] == 'content') {
        return await storeContents(event.body)
      }

      if(segments[0] == 'updatetime' && segments[1] == 'source') {
        return await updateLastCheckedAt(event.body)
      }

      if(segments[0] == 'verify') {
        const type = segments[1] 
        return await handleUpdate(params.ids, type)
      }

      if(segments[0] == 'delete') {
        const type = segments[1] 
        return await handleDelete(params.ids, type)
      }
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

async function getActiveContents() {
  const {data: sources, error} = await AdminDB.getActiveSource()
  
  if(error) 
         return error
  
  return response(200, {items: sources});
}

async function storeContents(_params) {
  const items = JSON.parse(_params).items

  const {insertedData, error} = await AdminDB.storeBulkContent(items)
  if(error) {           
      console.log(error)
  }

  return response(200, {msg: 'success'});
}

async function updateLastCheckedAt(_params) {
  const params = JSON.parse(_params)

  const {data, error} = await AdminDB.updateTime(params.last_checked_at, params.id)
  if(error) {           
      console.log(error)
  }

  return response(200, {msg: 'success'});
}