import jwt from "jsonwebtoken"
import supabase from "../../database.js"

export const getPublicKey = async (req, res) => {
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

  // Fetch the public key from the database
  const { data, error } = await supabase
    .from("users")
    .select("llave_publica")
    .eq("email", email)
    .single()
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  if (!data) {
    return res.status(404).json({ error: "Public key not found" })
  }

  const publicKey = data.llave_publica
  return res.status(200).json({ publicKey })
}
