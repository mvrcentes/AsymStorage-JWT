import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import classNames from "classnames"

import UploadFile from "./UploadFile"
import VerifyFile from "./VerifyFile"
import Browse from "./Browse"

const FileManage = ({
  privateKey,
  onPrivateKeyChange,
  publicKey,
  selectedUserEmail,
}) => {
  const [fileState, setFileState] = useState("Upload File")

  return (
    <Tabs
      value={fileState}
      onValueChange={setFileState}
      className="min-w-[700px] h-full">
      <TabsList className="grid w-full grid-cols-3 gap-2 p-2 h-auto">
        <TabsTrigger
          value="Upload File"
          className={classNames(
            "rounded-none border border-border bg-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-white",
            { "text-white": fileState === "Upload File" },
            { "!bg-transparent text-black": fileState !== "Upload File" }
          )}>
          Upload File
        </TabsTrigger>
        <TabsTrigger
          value="Verify File"
          className={classNames(
            "rounded-none border border-border bg-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-white",
            { "text-white": fileState === "Verify File" },
            { "!bg-transparent text-black": fileState !== "Verify File" }
          )}>
          Verify File
        </TabsTrigger>
        <TabsTrigger
          value="Browse"
          className={classNames(
            "rounded-none border border-border bg-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-white",
            { "text-white": fileState === "Browse" },
            { "!bg-transparent text-black": fileState !== "Browse" }
          )}>
          Browse
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Upload File">
        <Card>
          <CardContent className="space-y-2">
            <UploadFile
              privateKey={privateKey}
              onPrivateKeyChange={onPrivateKeyChange}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="Verify File">
        <Card>
          <CardContent className="space-y-2">
            <VerifyFile
              publicKey={publicKey}
              publicKeyOwner={selectedUserEmail}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="Browse">
        <Card>
          <CardContent className="space-y-2">
            <Browse />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default FileManage
