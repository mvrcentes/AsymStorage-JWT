import jwt from "jsonwebtoken"

import supabase from "../database.js"
import { hashPassword, comparePasswords } from "../utils/crypto.js"


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

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await comparePasswords(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // ✅ Generar JWT
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.status(200).json({ message: "Login successful", token })
  } catch (error) {
    console.log("Error logging in user:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
