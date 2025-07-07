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

export default async function Dashboard() {
  const continuelearningCourses = [
    {
      id: 1,
      title: "Creating Engaging Learning Journeys: UI/UX Best Practices",
      materials: 12,
      progress: 80,
      type: "Course",
      thumbnail: "/placeholder.svg?height=120&width=200",
      nextStep: "Mastering UI Design for Impactful Solutions",
    },
    {
      id: 2,
      title: "The Art of Blending Aesthetics and Functionality in UI/UX Design",
      materials: 12,
      progress: 30,
      type: "Course",
      thumbnail: "/placeholder.svg?height=120&width=200",
      nextStep: "Advanced techniques commonly used in UI/UX Design",
    },
  ];

  const allMaterials = [
    {
      id: 1,
      title: "5 Steps Optimizing User Experience",
      type: "Quiz",
      category: "UI/UX Design",
      status: "Urgent",
      progress: 0,
      points: 20,
      items: 20,
      itemType: "Question",
      thumbnail: "/placeholder.svg?height=120&width=200",
      certified: true,
    },
    {
      id: 2,
      title: "Heuristics: 10 Usability Principles To Improve UI Design",
      type: "Page",
      category: "Learning Design",
      status: "Not Urgent",
      progress: 40,
      items: 12,
      itemType: "Chapters",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "General Knowledge & Methodology - Layout & Speci...",
      type: "Learning Path",
      category: "Consistency",
      status: "Not Urgent",
      progress: 0,
      items: 20,
      itemType: "Path",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 4,
      title: "Mastering UI Design for Impactful Solutions",
      type: "Course",
      category: "UI/UX Design",
      status: "Not Urgent",
      progress: 50,
      items: 12,
      itemType: "Materials",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 5,
      title: "Advanced Color Theory in Design",
      type: "Course",
      category: "UI/UX Design",
      status: "Urgent",
      progress: 75,
      items: 12,
      itemType: "Chapters",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 6,
      title: "Typography Fundamentals",
      type: "Quiz",
      category: "Design Basics",
      status: "Not Urgent",
      progress: 0,
      items: 20,
      itemType: "Question",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 7,
      title: "Responsive Design Principles",
      type: "Learning Path",
      category: "Web Design",
      status: "Urgent",
      progress: 25,
      items: 15,
      itemType: "Path",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 8,
      title: "User Research Methods",
      type: "Course",
      category: "UX Research",
      status: "Not Urgent",
      progress: 60,
      items: 18,
      itemType: "Materials",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ];

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
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Continue Learning</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            {continuelearningCourses.map((course) => (
              <Card key={course.id} className="w-full overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-4 xl:flex-row">
                    <div className="relative h-full w-full xl:w-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          "https://plus.unsplash.com/premium_photo-1682284352941-58dceb6cd601?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={course.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <Badge className="absolute left-2 top-2 bg-primary/50 text-xs text-primary text-white backdrop-blur-xl">
                        {course.materials} Materials
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-primary">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {course.type}
                          </span>
                        </div>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-sm font-semibold">
                        {course.title}
                      </h3>
                      <div className="flex gap-8">
                        <div className="mb-3 flex-1">
                          <div className="mb-1 flex items-center gap-2 text-sm">
                            <span className="text-foreground/70">
                              Progress:
                            </span>
                            <span className="font-medium">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mb-2 w-fit"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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
