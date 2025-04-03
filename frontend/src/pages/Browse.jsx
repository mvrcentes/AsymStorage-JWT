import React, { useEffect, useState } from "react"

import { getFiles } from "../api/filemanage/filemanage"

const Browse = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fetched = await getFiles()
        setFiles(fetched)
        console.log("Fetched files:", files)
      } catch (error) {
        console.error("Error fetching files:", error)
      }
    }

    fetchFiles()
    console.log("first")
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-2">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="p-4 border rounded-md">
              <h2 className="font-semibold text-lg">{file.name}</h2>
              <p className="text-sm text-gray-600">{file.size} bytes</p>
              <p className="text-sm">
                Estado de firma:{" "}
                <span
                  className={
                    file.signature
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-medium"
                  }>
                  {file.signature ? "Firmado" : "No firmado"}
                </span>
              </p>
              <a
                href={file.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline">
                Descargar
              </a>
            </div>
          ))
        ) : (
          <div className="p-4 border rounded-md">
            <h2>No files found 🙂</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
