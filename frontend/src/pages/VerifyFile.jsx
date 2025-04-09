import React, { useState } from "react"
import { toast } from "sonner"

import FileOverlay from "../components/FileOverlay/FileOverlay"

import { getFileSignature } from "../api/filemanage/filemanage"
import { convertPemToBinary, detectKeyAlgorithm } from "@/utils/utils"

const VerifyFile = ({ publicKey, publicKeyOwner }) => {
  const [files, setFiles] = useState([])
  const algorithm = publicKey ? detectKeyAlgorithm(publicKey) : null

  const handleVerifyFile = async ({ files, key, algorithm }) => {
    try {
      const file = files[0]
      const filename = file.file.name

      const { signature, hash } = await getFileSignature(
        filename,
        publicKeyOwner
      )

      // const response = await fetch(file.url)
      // const arrayBuffer = await response.arrayBuffer()
      const arrayBuffer = await file.file.arrayBuffer()

      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
      const localHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      console.log({localHex}, { hash })

      const bufferA = new Uint8Array(hashBuffer)
      const bufferB = Uint8Array.from(
        hash.match(/.{1,2}/g).map((h) => parseInt(h, 16))
      )

      const isSameHash = bufferA.every((val, i) => val === bufferB[i])
      console.log("🔍 Byte-by-byte hash match:", isSameHash)

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

  console.log("🔐 publicKey en VerifyFile:", publicKey)

  return (
    <div className="flex w-full justify-center">
      {publicKey && (
        <FileOverlay
          props={{
            name: "Public key " + algorithm,
            value: files,
            buttonLabel: "Verify",
            keyValue: publicKey,
            algorithm: algorithm,
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
