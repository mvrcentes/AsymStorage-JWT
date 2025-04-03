import axios from "axios"

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/files"

export const uploadSign = async (file, signature, hash) => {
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
  formData.append("hash", hash)

  try {
    const response = await axios.post(
      `${API_URL}/files/upload/sign`,
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

export const getFileSignature = async (filename) => {
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
    const response = await axios.get(
      `${API_URL}/files/verify/${filename}`,
      config
    )
    return response.data
  } catch (error) {
    console.error("Error fetching file signature:", error)
    throw error
  }
}

export const uploadFileWithoutSignature = async (file, hash) => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No token found")
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  }

  const config = {
    headers: headers,
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("filename", file.name)
  formData.append("hash", hash)

  try {
    const response = await axios.post(
      `${API_URL}/files/upload/unsigned`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    console.error("Error uploading file without signature:", error)
    throw error
  }
}
