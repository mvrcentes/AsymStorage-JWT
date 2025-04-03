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

  const { filename, signature, hash } = req.body
  const file = req.files.file

  if (!filename || !signature || !hash) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const filePath = `files/${filename}`

    const { error: insertError } = await supabase.from("files").upsert(
      {
        nombre: filename,
        user_id: email,
        content_hash: hash,
        content: filePath,
        signature: signature,
      },
      {
        onConflict: ["nombre", "user_id", "content"],
      }
    )

    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }

    return res
      .status(200)
      .json({ message: "File metadata and signature recorded successfully" })
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

export const getFileSignature = async (req, res) => {
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

  const { filename } = req.params

  if (!filename) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Busca el archivo en la base de datos
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .select("*")
      .eq("nombre", filename)
      .eq("user_id", email)
      .single()

    if (!fileData.signature) {
      return res
        .status(400)
        .json({ error: "File does not have a signature yet" })
    }

    if (!fileData) {
      return res.status(404).json({ error: "File not found" })
    }

    if (fileError) {
      return res.status(500).json({ error: fileError.message })
    }

    return res
      .status(200)
      .json({ signature: fileData.signature, hash: fileData.content_hash })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const uploadFileWithoutSignature = async (req, res) => {
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

  const { filename, hash } = req.body
  const file = req.files?.file

  if (!filename || !hash || !file) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const fileBuffer = file.data
    const mimeType = file.mimetype

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

    const { error: insertError } = await supabase.from("files").upsert(
      {
        nombre: filename,
        user_id: email,
        content_hash: hash,
        content: contentPath,
        signature: null,
      },
      {
        onConflict: ["nombre", "user_id", "content"],
      }
    )

    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }

    return res
      .status(200)
      .json({ message: "File uploaded without signature successfully" })
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unexpected error", details: err.message })
  }
}
