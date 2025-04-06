"use client"
import { useEffect, useState } from "react"
import { FileText, Grid, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { fetchGithubRepos } from "@/actions/github/fetch-repos"
import { ProjectCard } from "@/components/project-card"
import { Project } from "@/lib/types"


export default function Dashboard() {
const [projects, setProjects] = useState<Project[]>([]) // Initialize projects state with an empty array
//   const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter();
console.log(projects);
  // Mock projects data
//   const projects: Project[] = [
//     {
//       id: "1",
//       title: "E-commerce Platform",
//       description: "A full-stack e-commerce platform built with Next.js, Tailwind CSS, and Stripe integration.",
//       tags: ["Next.js", "React", "Tailwind CSS", "Stripe"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "2 days ago",
//       status: "completed",
//       stars: 24,
//     },
//     {
//       id: "2",
//       title: "Task Management App",
//       description: "A collaborative task management application with real-time updates and team features.",
//       tags: ["React", "Firebase", "TypeScript"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "1 week ago",
//       status: "in-progress",
//       stars: 15,
//     },
//     {
//       id: "3",
//       title: "Personal Blog",
//       description: "A minimalist blog built with Next.js and MDX for content management.",
//       tags: ["Next.js", "MDX", "Tailwind CSS"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "3 weeks ago",
//       status: "completed",
//       stars: 32,
//     },
//     {
//       id: "4",
//       title: "Weather Dashboard",
//       description: "A weather dashboard that displays current and forecasted weather data from multiple sources.",
//       tags: ["React", "API", "Chart.js"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "1 month ago",
//       status: "completed",
//       stars: 18,
//     },
//     {
//       id: "5",
//       title: "AI Image Generator",
//       description: "An application that generates images using AI models with various style options.",
//       tags: ["Python", "TensorFlow", "React"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "2 days ago",
//       status: "in-progress",
//       stars: 45,
//     },
//     {
//       id: "6",
//       title: "Cryptocurrency Tracker",
//       description: "Track cryptocurrency prices, market caps, and trends with interactive charts.",
//       tags: ["React", "API", "Chart.js"],
//       image: "/placeholder.svg?height=150&width=300",
//       lastUpdated: "5 days ago",
//       status: "planned",
//       stars: 8,
//     },
//   ]
    useEffect(()=>{
        const getAllRepos = async () => {
            try {
                const res = await fetchGithubRepos();
                const data = res.projects;
                setProjects(data || []);
            } catch (error) {
                console.log(error);
            }
        }

        getAllRepos();
    },[])

  // Filter projects based on search query and active ta


  const handleGeneratePortfolio = () => {
    // In a real app, this would trigger the portfolio generation process
    router.push('/generate-portfolio') // Assuming you have a route for the portfolio generation
  }

  const handleViewPortfolio = () => {
    // In a real app, this would navigate to the portfolio view
    router.push('/portfolio') // Assuming you have a route for the portfolio view
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your projects and portfolio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" onClick={() => router.push('/projects')}>
            <Grid className="mr-2 h-4 w-4" />
            View Projects
          </Button>
          <Button variant="outline" onClick={handleGeneratePortfolio}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Portfolio
          </Button>
          <Button variant="secondary" onClick={handleViewPortfolio}>
            <User className="mr-2 h-4 w-4" />
            View Portfolio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-col-2 md:grid-cols-3 justify-between items-start md:items-center gap-5 mb-6">
      {projects.length > 0 ? (
                projects.map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No projects found matching your criteria</p>
                </div>
              )}
      </div>
    </div>
  )
}


