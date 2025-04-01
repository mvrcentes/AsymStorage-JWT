import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { uploadFile } from "../api/filemanage/filemanage"

const Browse = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchAllFiles = async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
  
      if (error) {
        console.error("❌ Error al obtener archivos:", error)
      } else {
        console.log("📁 Archivos encontrados:", data)
        setFiles(data)
      }
  
      setLoading(false)
    }
  
    fetchAllFiles()
  }, [])
  
  

  // Descargar archivo firmado desde storage
  const handleDownloadFileSigned = async (filename) => {
    const fullPath = `files/${filename}`
  
    const { data, error } = await supabase.storage
      .from("asymstorage")
      .createSignedUrl(fullPath, 60)
  
    if (error) {
      console.error("❌ Error al generar URL firmada:", error.message)
    } else {
      console.log("✅ URL firmada generada:", data.signedUrl)
      window.open(data.signedUrl, "_blank")
    }
  }
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Todos los archivos disponibles</h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando archivos...</p>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron archivos válidos.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li
              key={file.id}
              className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div className="mb-2 md:mb-0">
                <p><strong>📄 Nombre:</strong> {file.nombre}</p>
                <p><strong>👤 Usuario:</strong> {file.user_id}</p>
                <p><strong>🔐 Hash:</strong> <code className="break-all text-sm">{file.content_hash}</code></p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadFileSigned(file.nombre)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Descargar firmado
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Browse
