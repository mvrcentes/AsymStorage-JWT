import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import classNames from "classnames"
import { updateKey } from "@/api/keymanage/keymanage"

const KeyManager = ({ onPrivateKeyGenerated }) => {
  const [algorithm, setAlgorithm] = useState("RSA")
  const [publicKey, setPublicKey] = useState("")

  const generateKeyPair = async () => {
    if (algorithm === "RSA") {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-PSS",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      )

      const publicKeyData = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      )
      const privateKeyData = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      )

      const publicPem = convertToPem(publicKeyData, "PUBLIC KEY")
      const privatePem = convertToPem(privateKeyData, "PRIVATE KEY")

      setPublicKey(publicPem)
      downloadPrivateKey(privatePem)
      if (onPrivateKeyGenerated) {
        onPrivateKeyGenerated(privatePem)
      }
    }

    if (algorithm === "ECC") {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      )

      const publicKeyData = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      )
      const privateKeyData = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      )

      const publicPem = convertToPem(publicKeyData, "PUBLIC KEY")
      const privatePem = convertToPem(privateKeyData, "PRIVATE KEY")

      setPublicKey(publicPem)
      downloadPrivateKey(privatePem)
      if (onPrivateKeyGenerated) {
        onPrivateKeyGenerated(privatePem)
      }
    }
  }

  const convertToPem = (keyData, label) => {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(keyData)))
    const lines = base64.match(/.{1,64}/g).join("\n")
    return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`
  }

  const downloadPrivateKey = (pem) => {
    const blob = new Blob([pem], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "private-key.pem"
    link.click()
  }

  const handleUpdateKey = () => {
    console.log("Public key:", publicKey)

    updateKey(publicKey)
      .then((response) => {
        console.log("Key updated successfully:", response)
      })
      .catch((error) => {
        console.error("Error updating key:", error)
      })
  }

  return (
    <Card className="w-[500px] mt-10 space-y-4">
      <CardHeader>
        <CardTitle>Key Generator</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2 bg-muted p-1 rounded-md">
          <Button
            key={"RSA"}
            // variant="ghost"
            onClick={() => setAlgorithm("RSA")}
            className={classNames(
              { "w-[50%]": true },
              { "text-white": algorithm === "RSA" },
              { "text-black": algorithm === "ECC" },
              { "!bg-transparent text-black ": algorithm === "ECC" }
            )}>
            RSA
          </Button>

          <Button
            key={"ECC"}
            variant="default"
            onClick={() => setAlgorithm("ECC")}
            className={classNames(
              { "w-[50%]": true },
              { "text-white": algorithm === "ECC" },
              { "text-black": false },
              { "!bg-transparent text-black ": algorithm === "RSA" }
            )}>
            ECC
          </Button>
        </div>

        <Textarea
          rows={8}
          value={publicKey}
          className="min-h-[380px]"
          readOnly
          placeholder="Public key will appear here..."
        />
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button onClick={generateKeyPair}>Generate</Button>
        <Button
          variant="secondary"
          className="text-white"
          onClick={handleUpdateKey}>
          Update key
        </Button>
      </CardFooter>
    </Card>
  )
}

export default KeyManager
