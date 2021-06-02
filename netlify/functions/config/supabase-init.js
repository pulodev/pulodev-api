const SB = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

module.exports = {
    supabase: SB.createClient(SUPABASE_URL, SUPABASE_KEY, {
                headers: {
                    Authorization: `Bearer ${SUPABASE_JWT_SECRET}`,
                    apikey: `${SUPABASE_KEY}`,
                  }
                })
}