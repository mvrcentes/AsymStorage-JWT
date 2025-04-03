import React, { useState } from "react"

import FileOverlay from "../components/FileOverlay/FileOverlay"
import { Button } from "@/components/ui/button"
import { convertPemToBinary } from "@/utils/utils"

import { uploadFile } from "../api/filemanage/filemanage"

const UploadFile = ({ privateKey, onKeyChange }) => {
  const [files, setFiles] = useState([])

  // Función para convertir un buffer a string hexadecimal
  const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  const handleSignFile = async ({ files, key }) => {
    try {
      const file = files[0]
      const response = await fetch(file.url)
      const arrayBuffer = await response.arrayBuffer()

      // Calcular el hash del archivo (SHA-256) igual que en el backend
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const fileHash = bufferToHex(hashBuffer)

      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        convertPemToBinary(key),
        { name: "RSA-PSS", hash: "SHA-256" }, // ECC puede ser ECDSA, pero probaremos con RSA-PSS por ahora
        false,
        ["sign"]
      )

      const signature = await window.crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        privateKey,
        arrayBuffer
      )

      const signatureBase64 = btoa(
        String.fromCharCode(...new Uint8Array(signature))
      )
      console.log("✅ Firma generada (base64):", signatureBase64)

      uploadFile(file.file, signatureBase64, fileHash)
        .then((response) => {
          console.log("✅ Archivo subido:", response)
        })
        .catch((error) => {
          console.error("❌ Error al subir el archivo:", error)
        })
    } catch (error) {
      console.error("❌ Error al firmar:", error)
    }
  }

  return (
    <div className="flex w-full justify-center">
      <FileOverlay
        props={{
          name: "Private key",
          buttonLabel: "Firm",
          value: files,
          privateKey: privateKey,
          onKeyChange: onKeyChange,
          onChange: (files) => {
            setFiles(files)
            console.log(files)
          },
          onSubmit: handleSignFile,
        }}></FileOverlay>
    </div>
  )
}

export default UploadFile
