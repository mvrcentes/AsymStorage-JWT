import axios from "axios"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/files"

export const uploadFile = async (filename, firm, content) => {
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
    filename: filename,
    signature: firm,
    content: content,
  }
  try {
    const response = await axios.post(`${API_URL}/files/upload`, body, config)
    return response.data
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}
