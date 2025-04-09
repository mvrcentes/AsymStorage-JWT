import jwt from "jsonwebtoken"

import supabase from "../../database.js"
import { hashPassword, comparePasswords } from "../../utils/crypto.js"


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

    // Validar error por clave duplicada
    if (error) {
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("violates unique constraint")
      ) {
        return res.status(409).json({ error: "Email already exists" })
      }

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
    // Buscar al usuario por email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) {
      // Error al hacer la consulta (por ejemplo, error de conexión o algo inesperado)
      console.error("Error querying user:", error)
      return res.status(500).json({ error: "Database error" })
    }

    if (!user) {
      // Usuario no existe
      return res.status(404).json({ error: "User not found" })
    }

    // Validar contraseña
    const isPasswordValid = await comparePasswords(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" })
    }

    // Generar JWT si todo está OK
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
    console.error("Error logging in user:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
