import React, { useState, useEffect } from "react"
import { toast } from "sonner"

import FileOverlay from "../components/FileOverlay/FileOverlay"

import { getPublicKey } from "../api/user/user"
import { getFileSignature } from "../api/filemanage/filemanage"
import { convertPemToBinary } from "@/utils/utils"

const VerifyFile = () => {
  const [files, setFiles] = useState([])
  const [publicKey, setPublicKey] = useState(null)

  const handleVerifyFile = async ({ files, key }) => {
    try {
      const file = files[0]
      const filename = file.file.name

      // 1. Obtener firma + hash del backend
      const { signature, hash } = await getFileSignature(filename)

      // 2. Leer archivo y calcular hash local
      const response = await fetch(file.url)
      const arrayBuffer = await response.arrayBuffer()

      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const localHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      console.log("🔐 Clave pública recibida:", key.slice(0, 100))
      console.log("📁 Archivo:", file.file.name)
      console.log("📄 Firma (base64):", signature)
      console.log("🔢 Hash desde DB:", hash)
      console.log("🔢 Hash local:", localHex)

      if (localHex !== hash) {
        toast.error("❌ El archivo fue modificado o corrupto")
        return
      }

      // 3. Verificar firma digital
      const publicKey = await crypto.subtle.importKey(
        "spki",
        convertPemToBinary(key),
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["verify"]
      )

      const valid = await crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        publicKey,
        Uint8Array.from(atob(signature), (c) => c.charCodeAt(0)),
        arrayBuffer
      )

      if (valid) {
        toast.success("✅ Firma válida. Archivo NO fue modificado.")
      } else {
        toast.error("❌ Firma inválida. No coincide con la clave pública.")
      }
    } catch (error) {
      console.error("❌ Error verificando archivo:", error)
      toast.error(
        `Error verificando archivo: ${
          error?.response?.data?.error || error.message
        }`
      )
    }
  }
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const key = await getPublicKey()
        setPublicKey(key.publicKey)
      } catch (error) {
        console.error("Error fetching public key:", error)
      }
    }

    fetchPublicKey()
  }, [publicKey])

  return (
    <div className="flex w-full justify-center">
      {publicKey && (
        <FileOverlay
          props={{
            name: "Public key",
            value: files,
            buttonLabel: "Verify",
            privateKey: publicKey,
            onKeyChange: (key) => setPublicKey(key),
            onChange: (files) => setFiles(files),
            onClick:  handleVerifyFile,
          }}>
          <div className="flex flex-row gap-2 mt-6 justify-end" />
        </FileOverlay>
      )}
    </div>
  )
}

export default VerifyFile
