import React, { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

import { getAllUsers } from "../api/user/user"

const Users = ({ onPublicKeySelected }) => {
  const token = localStorage.getItem("token")
  const currentUser = token ? jwtDecode(token).email : null
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        console.log(data)
        const sorted = [...data].sort((a, b) => {
          if (a.email === currentUser) return -1
          if (b.email === currentUser) return 1
          return 0
        })
        setUsers(sorted)
      } catch (error) {
        toast.error("❌ No se pudieron cargar los usuarios")
        console.log(error)
      }
    }

    fetchUsers()
  }, [])

  // console.log(users[0].llave_publica, users[0].email)

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Usuarios disponibles</h2>
      <ul className="space-y-2">
        {users.map((user) => {
          const isMe = user.email === currentUser
          return (
            <li key={user.email} className="border p-2 rounded shadow-sm">
              <div className="flex items-center justify-between gap-10">
                <div>
                  <p className="font-medium text-gray-800">
                    {user.name}{" "}
                    {isMe && (
                      <span className="text-xs text-gray-400">(me)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    onPublicKeySelected(user.llave_publica, user.email)
                    toast.success(
                      `🔐 Llave de ${user.name} aplicada correctamente`
                    )
                  }}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition">
                  Use
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Users
