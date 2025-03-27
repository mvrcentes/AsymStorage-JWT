// utils/crypto.js
import bcrypt from "bcrypt"
import { generateKeyPairSync } from "crypto"

// 🔐 Hash de contraseña
export const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// 🔑 Generar llave pública/privada (RSA)
export const generateKeyPair = () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })

  return { publicKey, privateKey }
}