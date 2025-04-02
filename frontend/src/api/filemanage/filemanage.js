import axios from "axios"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/files"

export const uploadFile = async (
  file,
  signature
  // content,
  // mimetype = "application/octet-stream"
) => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No token found")
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const config = {
    headers: headers,
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("filename", file.name)
  formData.append("signature", signature)

  try {
    const response = await axios.post(
      `${API_URL}/files/upload`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export const getFiles = async () => {
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
    const response = await axios.get(`${API_URL}/files/files`, config)
    return response.data
  } catch (error) {
    console.error("Error fetching files:", error)
    throw error
  }
}
