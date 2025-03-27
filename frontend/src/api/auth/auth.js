import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth"

export const register = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name,
    })
    return response.data
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}
