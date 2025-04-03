import { jwtDecode } from "jwt-decode"

export const saveToken = (token) => {
  localStorage.setItem("token", token)
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    return false, error
  }
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const convertPemToBinary = (pem) => {
  const lines = pem.trim().split("\n")
  const base64 = lines.slice(1, -1).join("")
  const binary = atob(base64)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i)
  }
  return buffer
}

// Función para convertir un buffer a string hexadecimal
export const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export const detectKeyAlgorithm = (pem) => {
  const base64 = pem
    .replace(/-----BEGIN (?:PUBLIC|PRIVATE) KEY-----/, "")
    .replace(/-----END (?:PUBLIC|PRIVATE) KEY-----/, "")
    .replace(/\s/g, "")
  const byteLength = (base64.length * 3) / 4

  console.log("🔍 Detección de algoritmo - bytes:", byteLength)

  // Claves ECC son ~91 bytes, RSA son ~270-400+
  return byteLength > 270 ? "RSA" : "ECC"
}
