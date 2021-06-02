const { supabase } = require('../config/supabase-init')

//Get single data
exports.show = async (id) => 
  await supabase
              .from('sources')
              .select('*')
              .eq('id', id)
              .single()

//Check if url is in database
exports.containsUrl = async (url) =>
     await supabase
            .from('sources')
            .select('id, url')
            .ilike('url', `%${url}`)

//Insert Data
exports.store = async (params) =>
    await supabase
                .from('sources')
                .insert([
                    {
                        contributor: params.contributor,
                        title: params.title,
                        url: params.url,
                        media: params.media
                    },
                ])


//Update Data
exports.update = async function(params, id) {
    return await supabase
                .from('sources')
                .update([
                    {
                        title: params.title,
                        url: params.url,
                        media: params.media,
                        updated_at: new Date()
                    },
                ])
                .match({
                    id: id
                })
}

exports.updateTime = async function(lastBuildIime, id) {
    return await supabase
                .from('sources')
                .update([
                    {
                        last_checked_at: lastBuildIime
                    },
                ])
                .match({
                    id: id
                })
}

//Update Data
exports.updateStatusBulk = async (ids) => 
     await supabase
            .from('sources')
            .update({draft: false})
            .in('id', ids)


exports.getDraft = async () =>
    await supabase
      .from('sources')
      .select('*')
      .is('draft',true)
      .is('deleted_at', null)