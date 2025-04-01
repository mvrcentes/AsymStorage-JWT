import React, { useState } from "react"
import FileOverlay from "../components/FileOverlay/FileOverlay"
import { convertPemToBinary } from "@/utils/utils"

const VerifyFile = ({ publicKey, getSignature }) => {
  const [files, setFiles] = useState([])
  const [result, setResult] = useState(null)

  const handleVerify = async ({ files }) => {
    const file = files[0]
    if (!file || !publicKey) {
      alert("Falta el archivo o la clave pública")
      return
    }

    try {
      const response = await fetch(file.url)
      const fileBuffer = await response.arrayBuffer()

      const signatureBase64 = await getSignature(file.file.name)
      if (!signatureBase64) {
        setResult("❌ Firma no encontrada.")
        return
      }

      const importedPublicKey = await window.crypto.subtle.importKey(
        "spki",
        convertPemToBinary(publicKey),
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["verify"]
      )

      const signature = Uint8Array.from(
        atob(signatureBase64),
        (c) => c.charCodeAt(0)
      )

      const isValid = await window.crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        importedPublicKey,
        signature,
        fileBuffer
      )

      setResult(isValid ? "✅ Firma válida." : "❌ Firma inválida.")
    } catch (error) {
      console.error("❌ Error verificando firma:", error)
      setResult("❌ Error durante la verificación.")
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-2xl">
        <FileOverlay
          props={{
            name: "Public key",
            buttonLabel: "Verificar",
            value: files,
            onChange: (newFiles) => {
              setFiles(newFiles)
              console.log(newFiles)
            },
            onSubmit: handleVerify,
          }}
        />
        {result && (
          <p className="mt-4 text-center font-semibold text-lg">
            {result}
          </p>
        )}
      </div>
    </div>
  )
}

export default VerifyFile
