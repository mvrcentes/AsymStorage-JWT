import React, { useState } from "react"

import FileOverlay from "../components/FileOverlay/FileOverlay"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { convertPemToBinary } from "@/utils/utils"

import {
  uploadSign,
  uploadFileWithoutSignature,
} from "../api/filemanage/filemanage"

const UploadFile = ({ privateKey, onKeyChange }) => {
  const [files, setFiles] = useState([])

  // Función para convertir un buffer a string hexadecimal
  const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  const handleUploadFileOnly = async ({ files }) => {
    try {
      if (!files || files.length === 0) {
        toast.error("No file selected")
        return
      }

      const file = files[0]
      if (!file.file) {
        toast.error("Archivo inválido")
        return
      }

      const response = await fetch(file.url)
      const arrayBuffer = await response.arrayBuffer()

      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const fileHash = bufferToHex(hashBuffer)

      await uploadFileWithoutSignature(file.file, fileHash)
      toast.success("✅ Archivo subido")
    } catch (error) {
      toast.error("Error uploading file: " + error.message)
      console.error(error)
    }
  }

  const handleSignOnly = async ({ files, key, algorithm }) => {
    try {
      const file = files[0]
      const response = await fetch(file.url)
      const arrayBuffer = await response.arrayBuffer()

      // Calcular hash
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const fileHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      // Importar clave privada
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        convertPemToBinary(key),
        {
          name: algorithm === "ECC" ? "ECDSA" : "RSA-PSS",
          ...(algorithm === "ECC"
            ? { namedCurve: "P-256" }
            : { hash: "SHA-256" }),
        },
        false,
        ["sign"]
      )

      // Firmar
      const signature = await window.crypto.subtle.sign(
        algorithm === "ECC"
          ? { name: "ECDSA", hash: { name: "SHA-256" } }
          : { name: "RSA-PSS", saltLength: 32 },
        privateKey,
        arrayBuffer
      )

      const signatureBase64 = btoa(
        String.fromCharCode(...new Uint8Array(signature))
      )

      await uploadSign(file.file, signatureBase64, fileHash)

      toast.success("🖋 Firma generada y enviada correctamente")
    } catch (error) {
      toast.error("Error al firmar archivo: " + error.message)
      console.error("❌ Error al firmar:", error)
    }
  }

  return (
    <div className="flex w-full justify-center">
      <FileOverlay
        props={{
          name: "Private key",
          buttonLabel: "Upload firm",
          value: files,
          privateKey: privateKey,
          onKeyChange: onKeyChange,
          onChange: (files) => {
            setFiles(files)
            console.log(files)
          },
          onClick: handleSignOnly,
        }}>
        <Button
          type="submit"
          onClick={() => {
            console.log(files)
            handleUploadFileOnly({ files })
          }}>
          Upload file
        </Button>
      </FileOverlay>
    </div>
  )
}

export default UploadFile
