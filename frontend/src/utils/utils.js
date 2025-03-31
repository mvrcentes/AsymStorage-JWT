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


