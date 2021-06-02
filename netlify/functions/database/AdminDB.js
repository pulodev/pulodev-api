const { supabase } = require('../config/supabase-init')

//For aggregate
exports.getActiveSource = async () =>
      await supabase
              .from('sources')
              .select('*')
              .is('draft', false)
              .is('deleted_at', null)

exports.storeBulkContent = async function(items) {
    const { data, error } = await supabase
                              .from('contents')
                              .upsert(items , { onConflict: 'url'})

   if (error) console.log('error', error)
    return data
}

exports.updateTime = async (lastBuildIime, id) =>
    await supabase
            .from('sources')
            .update([
                {
                    last_checked_at: lastBuildIime
                },
            ])
            .match({
                id: id
            })

//General: can be for sources || contents
exports.updateStatusBulk = async (type, ids) => 
     await supabase
            .from(type)
            .update({draft: false})
            .in('id', ids)

exports.deleteBulk = async (type, ids) => 
    await supabase
            .from(type)
            .update({deleted_at: new Date() })
            .in('id', ids)

exports.getDraft = async (type) =>
    await supabase
      .from(type)
      .select('*')
      .is('draft',true)
      .is('deleted_at', null)