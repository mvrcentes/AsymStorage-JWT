import React, { useState, useEffect } from "react"
import { toast } from "sonner"

import FileOverlay from "../components/FileOverlay/FileOverlay"

import { getPublicKey } from "../api/user/user"
import { getFileSignature } from "../api/filemanage/filemanage"
import { convertPemToBinary, detectKeyAlgorithm } from "@/utils/utils"

const VerifyFile = () => {
  const [files, setFiles] = useState([])
  const [publicKey, setPublicKey] = useState(null)
  const algorithm = publicKey ? detectKeyAlgorithm(publicKey) : null

  const handleVerifyFile = async ({ files, key, algorithm }) => {
    try {
      const file = files[0]
      const filename = file.file.name

      const { signature, hash } = await getFileSignature(filename)

      const response = await fetch(file.url)
      const arrayBuffer = await response.arrayBuffer()

      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const localHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      if (localHex !== hash) {
        toast.error("❌ El archivo fue modificado o corrupto")
        return
      }

      const publicKey = await crypto.subtle.importKey(
        "spki",
        convertPemToBinary(key),
        {
          name: algorithm === "ECC" ? "ECDSA" : "RSA-PSS",
          ...(algorithm === "ECC"
            ? { namedCurve: "P-256" }
            : { hash: "SHA-256" }),
        },
        false,
        ["verify"]
      )

      const valid = await crypto.subtle.verify(
        algorithm === "ECC"
          ? { name: "ECDSA", hash: { name: "SHA-256" } }
          : { name: "RSA-PSS", saltLength: 32 },
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
      toast.error(
        `Error verificando archivo: ${
          error?.response?.data?.error || error.message
        }`
      )
      console.error("❌ Error verificando archivo:", error)
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
            name: "Public key " + algorithm,
            value: files,
            buttonLabel: "Verify",
            privateKey: publicKey,
            algorithm: algorithm,
            onKeyChange: (key) => setPublicKey(key),
            onChange: (files) => setFiles(files),
            onClick: handleVerifyFile,
          }}>
          <div className="flex flex-row gap-2 mt-6 justify-end" />
        </FileOverlay>
      )}
    </div>
  )
}

export default VerifyFile
