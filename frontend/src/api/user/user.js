import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/user"

export const getPublicKey = async () => {
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
  try {
    const response = await axios.get(`${API_URL}/user/public-key`, config)
    return response.data
  } catch (error) {
    console.error("Error fetching public key:", error)
    throw error
  }
}
