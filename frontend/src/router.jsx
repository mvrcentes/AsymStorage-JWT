import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter