import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Textarea } from "@/components/ui/textarea"
import { MultiFileDropzone } from "@/components/MultiFileDropzone"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

const formSchema = z
  .object({
    key: z.string().min(1, "Key is required"),
    file: z.any(),
  })
  .superRefine((data, ctx) => {
    if (!Array.isArray(data.file) || data.file.length === 0) {
      ctx.addIssue({
        path: ["file"],
        code: z.ZodIssueCode.custom,
        message: "At least one file is required",
      })
    } else {
      const file = data.file[0]
      if (file.size > 1 * 1024 * 1024) {
        ctx.addIssue({
          path: ["file"],
          code: z.ZodIssueCode.too_big,
          message: "File size exceeds 1MB",
        })
      }
    }
  })

const FileOverlay = ({ props, children }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: props.privateKey || "",
      file: [],
    },
  })

  const handleSubmit = (data) => {
    if (props.onSubmit) {
      props.onSubmit({ files: data.file, key: data.key })
    }
  }

  useEffect(() => {
    form.setValue("key", props.privateKey)
  }, [props.privateKey, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col w-full justify-center">
        <div className="flex flex-col w-full justify-center">
          <div className="flex flex-col gap-2">
            <h1 className="!text-2xl ">{props.name}</h1>

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="min-h-[250px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiFileDropzone
                      value={field.value}
                      dropzoneOptions={{
                        maxFiles: 1,
                        maxSize: 1 * 1024 * 1024,
                      }}
                      onChange={(files) => field.onChange(files)}
                      onFilesAdded={async (addedFiles) =>
                        console.log("Added:", addedFiles)
                      }
                      accept={{ "application/pdf": [".pdf", ".pem"] }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {children}
            <Button type="submit">{props.buttonLabel || "Submit"}</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default FileOverlay
