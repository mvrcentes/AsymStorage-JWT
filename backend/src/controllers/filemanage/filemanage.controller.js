import crypto from "crypto"
import jwt from "jsonwebtoken"
import supabase from "../../database.js"

export const uploadSignedFile = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  let email

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    email = decoded.email
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }

  const { filename, signature, content } = req.body
  if (!filename || !signature || !content) {
    console.log(filename, signature, content)
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Convert base64 content to buffer
    const fileBuffer = Buffer.from(content, "base64")

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("asymstorage")
      .upload(`files/${Date.now()}_${filename}`, fileBuffer, {
        contentType: "application/octet-stream",
        upsert: false,
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    const contentPath = uploadData.path
    const contentHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex")

    // Insert into 'files' table
    const { error: insertError } = await supabase.from("files").insert({
      nombre: filename,
      user_id: email,
      content_hash: contentHash,
      content: contentPath,
      signature,
    })

    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }

    return res
      .status(200)
      .json({ message: "File uploaded and recorded successfully" })
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unexpected error", details: err.message })
  }
}
