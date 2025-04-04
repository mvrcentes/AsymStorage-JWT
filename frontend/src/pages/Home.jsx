import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import KeyManager from "../components/KeyManager/KeyManager"
import FileManage from "./FileManage"
import { jwtDecode } from "jwt-decode"

const Home = () => {
  const [userName, setUserName] = useState("")
  const [privateKey, setPrivateKey] = useState("test1")
  const navigate = useNavigate() // 🔥 aquí estaba el problema

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserName(decodedToken.name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth")
  }

  return (
    <div className="flex flex-row justify-center items-center gap-4 min-w-screen">
      <KeyManager onPrivateKeyGenerated={setPrivateKey} />
      <div className="flex flex-col gap-8">
        <h1>Welcome {userName}</h1>
        <FileManage privateKey={privateKey} onKeyChange={setPrivateKey} />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
