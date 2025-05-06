"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the form schema with Zod
const formSchema = z.object({
  video: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Video is required",
  }),
})

type FormValues = {
  video: FileList
}

export function VideoUploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void
  onUpload: (videoUrl: string) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const handleUpload = async (values: FormValues) => {
    const file = values.video[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 300)

    try {
      // In a real app, you would upload the file to your storage service
      // and get back a URL to the uploaded video
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock video URL - in a real app, this would come from your storage service
      const videoUrl = `https://example.com/videos/${file.name}`

      clearInterval(interval)
      setProgress(100)

      // Wait a moment to show 100% before closing
      setTimeout(() => {
        onUpload(videoUrl)
      }, 500)
    } catch (error) {
      console.error("Upload failed:", error)
      clearInterval(interval)
      setIsUploading(false)
      alert("Upload failed")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="video"
              render={({ field: { onChange, value: _, ...rest } }) => (
                <FormItem>
                  <FormLabel>Select Video File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      disabled={isUploading}
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUploading && (
              <div className="space-y-2">
                <div className="text-sm">Uploading: {progress}%</div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isUploading} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
