const { supabase } = require('../config/supabase-init')

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