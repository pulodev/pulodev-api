const { supabase } = require('../config/supabase-init')

const perPage = 25

//Get all data
exports.index = async function(_searchQuery, _media, _page) {
    let range_start = 0
    let range_end = _page * perPage 

    if(_page != 1) 
        range_start = (_page * perPage) - (perPage -1)

    return await supabase
              .from('contents')
              .select('*', { count: 'exact' })
              .ilike('title', `%${_searchQuery}%`)
              .like('media', _media)
              .eq('draft', false)     
              .range(range_start, range_end)    
              .order('original_published_at', { ascending: false })
}

//Get single data
exports.show = async function(id) {
  let { data: content, err } = await supabase
              .from('contents')
              .select('*')
              .eq('id', id)
              .single()

    if (err) console.log('error', err)

    return content
}

//Check if url is in database
exports.containsUrl = async (url) =>
     await supabase
            .from('contents')
            .select('id, url')
            .ilike('url', `%${url}`)

//Insert Data
exports.store = async (params) =>
    await supabase
            .from('contents')
            .insert([
                {
                    title: params.title,
                    body: params.body,
                    owner: params.owner ? params.owner : '',
                    thumbnail: params.thumbnail ? params.thumbnail : '',
                    url: params.url,
                    tags: params.tags,
                    media: params.media,
                    original_published_at: params.original_published_at ? params.original_published_at : new Date(),
                    contributor: params.contributor ? params.contributor : ''
                },
            ])

exports.storeBulk = async function(items) {
    const { data, error } = await supabase
                              .from('contents')
                              .upsert(items , { onConflict: 'url'})

   if (error) console.log('error', error)
    return data
}

//Update Data
exports.updateStatusBulk = async (ids) => 
     await supabase
            .from('contents')
            .update({draft: false})
            .in('id', ids)


exports.getDraft = async () =>
    await supabase
              .from('contents')
              .select('*')
              .eq('draft', true)