import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzhjyaovpgzssopeyjqy.supabase.co'
const SUPABASE_KEY = 'sb_publishable_pGDF9ylp-JpoJgX_JxGHMQ_GcfFJDmw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)