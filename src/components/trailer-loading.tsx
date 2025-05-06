"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function TrailerProcessingPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real application, you would check the status here
    // before refreshing the page
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Processing Your Trailer</h1>
            <p className="text-muted-foreground">
              Your trailer has been uploaded successfully and is now being processed. This may take a few minutes
              depending on the file size.
            </p>
          </div>

          <div className="w-full space-y-4">
        

            <Button onClick={handleRefresh} className="w-full" disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Status"
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            You can leave this page and come back later. Your trailer will continue processing.
          </p>
        </div>
      </div>
    </div>
  )
}