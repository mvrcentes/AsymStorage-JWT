import axios from "axios"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/keymanage"

export const updateKey = async (publicKey) => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No token found")
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
  const config = {
    headers: headers,
  }
  const body = {
    publicKey: publicKey,
  }
  try {
    const response = await axios.put(
      `${API_URL}/keymanage/update-key`,
      body,
      config
    )
    return response.data
  } catch (error) {
    console.error("Error updating public key:", error)
    throw error
  }
}
