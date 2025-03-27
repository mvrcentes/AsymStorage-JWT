import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
// import Login from "./pages/Login"
import { Button } from "@/components/ui/Button"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
