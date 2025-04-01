import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

export const supabaseAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

if (!supabase) {
  throw new Error("Supabase client could not be created")
}

const { data, error } = await supabase.storage.listBuckets()
console.log(data)

export default supabase
