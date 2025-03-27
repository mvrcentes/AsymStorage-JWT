import supabase from "../database.js"
import { hashPassword } from "../utils/crypto.js"

export const register = async (req, res) => {
  const { email, password, name, publicKey } = req.body

  try {
    const hashedPassword = await hashPassword(password)

    const { data, error } = await supabase.from("users").insert([
      {
        email: email,
        password: hashedPassword,
        name: name,
        llave_publica: publicKey,
      },
    ])

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.log("Error registering user:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
