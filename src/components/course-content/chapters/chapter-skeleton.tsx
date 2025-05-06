export function ChapterSkeleton() {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-48 bg-muted rounded"></div>
          <div className="h-8 w-3/4 bg-muted rounded"></div>
        </div>
  
        <div className="aspect-video bg-muted rounded-lg"></div>
  
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
        </div>
  
        <div className="flex justify-between pt-6">
          <div className="h-10 w-32 bg-muted rounded"></div>
          <div className="h-10 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }
  