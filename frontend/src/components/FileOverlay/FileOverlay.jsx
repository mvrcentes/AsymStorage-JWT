import React, { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { MultiFileDropzone } from "@/components/MultiFileDropzone"

const FileOverlay = ({ props, children }) => {
  const [files, setFiles] = useState([])

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="!text-2xl ">{props.name}</h1>

        <Textarea className="min-h-[200px]" />

        <MultiFileDropzone
          value={files}
          dropzoneOptions={{
            maxFiles: 1,
            maxSize: 1 * 1024 * 1024,
          }}
          onChange={(files) => {
            setFiles(files)
            console.log(files)
          }}
          onFilesAdded={async (addedFiles) => {
            console.log(addedFiles)
          }}
          accept={{ "application/pdf": [".pdf", ".pem"] }}
        />
      </div>

      <div>{children}</div>
    </div>
  )
}

export default FileOverlay
