import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Play, Check, Star } from "lucide-react"

export function CourseDetails() {
  const learningPoints = [
    "Setting up the environment",
    "Advanced HTML Practices",
    "Build a portfolio website",
    "Responsive Designs",
    "Understand HTML Programming",
    "Code HTML",
    "Start building beautiful websites",
  ]

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/course-thumbnail.png" alt="Course thumbnail" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="lg" className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-gray-900">
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* About Course */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Course</h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Unlock the power of Figma, the leading collaborative design tool, with our comprehensive online course.
                Whether you&apos;re a novice or looking to enhance your skills, this course will guide you through Figma&apos;s
                robust features and workflows.
              </p>
              <p>
                Perfect for UI/UX designers, product managers, and anyone interested in modern design tools. Join us to
                elevate your design skills and boost your productivity with Figma!
              </p>
            </div>
          </div>

          {/* What You'll Learn */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You&apos;ll Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learningPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="author" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">Crystal Lucas</h4>
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">(4.8)</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">UI/UX Specialist</p>
                  <p className="text-sm text-gray-700">
                    Crystal is a seasoned UI/UX designer with over 8 years of experience in creating beautiful and
                    functional digital experiences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <div className="text-center py-8 text-gray-500">FAQ content would go here</div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <div className="text-center py-8 text-gray-500">Announcements content would go here</div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="text-center py-8 text-gray-500">Reviews content would go here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
