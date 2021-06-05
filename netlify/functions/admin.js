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

    //aggregator
    if (event.httpMethod === "POST") { 
      const params = JSON.parse(event.body)


      //ADMIN PROTECTED
      if(verifySecretCode(params.secret_code) == false)
        return response(403, { errors:'not allowed, check ur secret code' });
      
      if(segments[0] == 'store' && segments[1] == 'content') {
        return await storeContents(params)
      }

      if(segments[0] == 'updatetime' && segments[1] == 'source') {
        return await updateLastCheckedAt(params)
      }

      if(segments[0] == 'publish') {
        const type = segments[1] 
        return await publishDraft(params, type)
      }

      if(segments[0] == 'delete') {
        const type = segments[1] 
        return await handleDelete(params, type)
      }
    }
}

function verifySecretCode(secret_code) {
  if(process.env.CUSTOM_ADMIN_KEY != secret_code)
    return false

  return true
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


async function publishDraft(params, type) {
  const ids = params.ids

  //to handle single id
  let id_array = []
  let all_ids = id_array.concat(ids) 
  
  const {data, err} = await AdminDB.updateStatusBulk(type, all_ids)
  if(err) console.log(err)

  return response(200, {msg: `${type} successfully published`});
}

async function handleDelete(params, type) {
  const ids = params.ids

  //to handle single id
  let id_array = []
  let all_ids = id_array.concat(ids) 
  
  const {data, err} = await AdminDB.deleteBulk(type, all_ids)
  if(err) console.log(err)

  return response(200, {msg: `${type} successfully deleted`});
}

async function getActiveContents() {
  const {data: sources, error} = await AdminDB.getActiveSource()
  
  if(error) 
         return error
  
  return response(200, {items: sources});
}

async function storeContents(_params) {
  const items = _params.items

  const {insertedData, error} = await AdminDB.storeBulkContent(items)
  if(error) {           
      console.log(error)
  }

  return response(200, {msg: 'success'});
}

async function updateLastCheckedAt(params) {
  const {data, error} = await AdminDB.updateTime(params.last_checked_at, params.id)
  if(error) {           
      console.log(error)
  }

  return response(200, {msg: 'success'});
}