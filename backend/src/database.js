import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

if (!supabase) {
  throw new Error("Supabase client could not be created")
}

const { data, error } = await supabase.storage.listBuckets()
console.log(data)

// const { data: bucketData, error: bucketError } =
//   await supabase.storage.getBucket("asymstorage")
// console.log(bucketData)
// if (bucketError) {
//   console.error("Error fetching bucket data:", bucketError)
// }

export default supabase
