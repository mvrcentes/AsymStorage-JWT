import crypto from "crypto"
import jwt from "jsonwebtoken"
import supabase, { supabaseAdmin } from "../../database.js"

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

  const { filename, signature } = req.body
  const file = req.files.file

  if (!filename || !signature) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Convert base64 content to buffer
    const fileBuffer = file.data
    const mimeType = file.mimetype

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("asymstorage")
      .upload(`files/${filename}`, fileBuffer, {
        contentType: mimeType,
        upsert: true,
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

export const getFiles = async (req, res) => {
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

  try {
    // Lista todos los archivos que realmente existen en Storage
    const { data: storageFiles, error: listError } = await supabaseAdmin.storage
      .from("asymstorage")
      .list("files", {
        limit: 100,
        offset: 0,
      })

    if (listError) {
      return res.status(500).json({ error: listError.message })
    }

    // Extrae todos los nombres con prefijo completo
    const validPaths = storageFiles.map((f) => `files/${f.name}`)

    // Ahora consulta solo los archivos del usuario actual Y que existan en Storage
    const { data: userFiles, error: fileError } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", email)
      .in("content", validPaths)

    if (fileError) {
      return res.status(500).json({ error: fileError.message })
    }

    // Finalmente, mapea con los datos reales del archivo
    const response = userFiles.map((file) => {
      const matchingFile = storageFiles.find(
        (f) => file.content === `files/${f.name}`
      )

      const { data: urlData } = supabase.storage
        .from("asymstorage")
        .getPublicUrl(file.content, {
          download: true,
        })

      return {
        name: file.nombre,
        downloadUrl: urlData.publicUrl,
        size: matchingFile?.metadata?.size ?? 0,
        mimetype: matchingFile?.metadata?.mimetype ?? "unknown",
        hash: file.content_hash,
        signature: file.signature,
      }
    })

    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
