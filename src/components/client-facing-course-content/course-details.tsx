import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, Check, Star } from "lucide-react";
import { GetCourseById } from "@/types/courses";
import CourseClientTrailer from "./course-trailer";

export function CourseDetails({
  course,
  chapterId,
}: {
  course: GetCourseById;
  chapterId?: string;
}) {
  const learningPoints = [
    "Setting up the environment",
    "Advanced HTML Practices",
    "Build a portfolio website",
    "Responsive Designs",
    "Understand HTML Programming",
    "Code HTML",
    "Start building beautiful websites",
  ];

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="overflow-hidden">
        {!chapterId && course.course?.trailer?.muxPlaybackId && (
          <CourseClientTrailer
            trailerMuxPlaybackId={course.course?.trailer?.muxPlaybackId}
            thumbnail={course.course?.trailer?.thumbnail ?? course.course?.thumbnail?.[0]?.url ?? ""}
          />
        )}
        
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

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* About Course */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              About Course
            </h3>
            <div className="space-y-3 text-foreground/60">
              {course.course?.description}
            </div>
          </div>

          {/* What You'll Learn */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              What You&apos;ll Learn
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {learningPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground/70">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="author" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">
                      Crystal Lucas
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">(4.8)</span>
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">UI/UX Specialist</p>
                  <p className="text-sm text-gray-700">
                    Crystal is a seasoned UI/UX designer with over 8 years of
                    experience in creating beautiful and functional digital
                    experiences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <div className="py-8 text-center text-foreground">
            FAQ content would go here
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <div className="py-8 text-center text-foreground">
            Announcements content would go here
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="py-8 text-center text-foreground">
            Reviews content would go here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
