import jwt from "jsonwebtoken"
import supabase from "../../database.js"

export const updatePublicKey = async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const email = decoded.email
    const { publicKey } = req.body

    if (!publicKey) {
      return res.status(400).json({ error: "Missing publicKey" })
    }

    const { data, error } = await supabase
      .from("users")
      .update({ llave_publica: publicKey })
      .eq("email", email)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ message: "Public key updated successfully" })
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
