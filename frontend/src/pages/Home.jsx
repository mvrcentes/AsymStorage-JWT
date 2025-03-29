import React, { Children, useEffect, useState } from "react"

import KeyManager from "../components/KeyManager/KeyManager"
import FileManage from "./FileManage"
import { jwtDecode } from "jwt-decode"

const Home = () => {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserName(decodedToken.name)
    }
  }, [])

  return (
    <div className="flex flex-row justify-center items-center gap-4 min-w-screen ">
      <KeyManager />
      <div className="flex flex-col gap-8">
        <h1>Welcome {userName}</h1>
        <FileManage />
      </div>
    </div>
  )
}

export default Home
