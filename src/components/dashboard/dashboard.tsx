import {
  Search,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Play,
  Star,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import ContinuedLearning from "./continued-learning";
import { auth } from "@/server/auth";

export default async function Dashboard() {
  const session = await auth();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Quiz":
        return <Award className="h-4 w-4" />;
      case "Course":
        return <BookOpen className="h-4 w-4" />;
      case "Learning Path":
        return <Users className="h-4 w-4" />;
      case "Page":
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Quiz":
        return "bg-yellow-500";
      case "Course":
        return "bg-blue-500";
      case "Learning Path":
        return "bg-purple-500";
      case "Page":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const courses = await api.courses.getAllAdminCourses({});

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Continue Learning Section */}
        {session?.user && !!session.user.datePaid && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Continue Learning</h2>
            <ContinuedLearning />
          </section>
        )}
        {/* All Materials Section */}
        <section className="w-full space-y-6">
          <div className="flex justify-between xl:items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">All Materials</h2>
              <Badge variant="secondary">27</Badge>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="items flex w-full flex-col justify-between gap-3 xl:flex-row xl:items-center">
            <Tabs defaultValue="not-started" className="w-auto">
              <TabsList className="justify-between bg-muted max-sm:w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-primary"
                  value="not-started"
                >
                  Not Started
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-primary"
                  value="in-progress"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-primary"
                  value="completed"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col items-center gap-3 xl:flex-row">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input placeholder="Search..." className="pl-10 xl:w-64" />
              </div>

              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-2 bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Add Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-2 bg-transparent"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Short by
                </Button>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {courses.courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        course.thumbnail[0]?.url ??
                        "https://via.placeholder.com/200x120"
                      }
                      alt={course.thumbnail[0]?.name}
                      className="h-32 w-full object-cover"
                    />
                    <Badge
                      className={`absolute left-2 top-2 text-xs text-white`}
                    >
                      {course.tags}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-2">
                      {/* <div
                        className={`rounded p-1 ${getTypeColor(material.type)} text-white`}
                      >
                        {getTypeIcon(material.type)}
                      </div> */}
                      {/* <span className="text-sm font-medium">
                        {material.type}
                      </span> */}

                      <Badge variant="outline" className="text-xs">
                        Certified
                      </Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold">
                      {course.title}
                    </h3>

                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.tags[0]}
                      </Badge>
                      {/* <Badge
                        variant={
                          material.status === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {material.status}
                      </Badge> */}
                    </div>

                    {/* {material.progress > 0 ? (
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium">
                            {material.progress}%
                          </span>
                        </div>
                        <Progress value={material.progress} className="h-2" />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">
                          Not Started
                        </span>
                      </div>
                    )}

                    <div className="flex h-full flex-1 items-end">
                      <Button
                        size="sm"
                        className="w-full"
                        variant={material.progress > 0 ? "default" : "outline"}
                      >
                        {material.progress > 0
                          ? "Continue"
                          : material.progress === 0 && material.type === "Quiz"
                            ? "View"
                            : "Start"}
                      </Button>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
