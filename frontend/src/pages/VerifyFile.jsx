import React, { useState } from "react"

import FileOverlay from "../components/FileOverlay/FileOverlay"
import { Button } from "@/components/ui/button"

const VerifyFile = () => {
  const [files, setFiles] = useState([])
  return (
    <div className="flex w-full justify-center">
      <FileOverlay
        props={{
          name: "Public key",
          value: files,
          onChange: (files) => {
            setFiles(files)
            console.log(files)
          },
        }}>
        <div className="flex flex-row gap-2 mt-6 justify-end">
          {/* <Button>Firm</Button> */}

          <Button>Verify</Button>
        </div>
      </FileOverlay>
    </div>
  )
}

export default VerifyFile
