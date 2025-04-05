"use client"

import { useEffect, useState } from "react"

import { fetchGithubRepos } from "@/actions/github/fetch-repos"
import { ProjectCard } from "@/components/project-card"
import { Project } from "@/lib/types"



export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetchGithubRepos();
        console.log(response)
        // const data = await response.json()
        
        if (response.success && response.projects?.length) {
          setProjects(response.projects)
        } else {
          setError('Failed to fetch projects')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('An error occurred while fetching projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-2">Loading projects...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            My Projects
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4">
            A collection of my GitHub repositories and projects
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
      ))}
        </div>
      </div>
    </div>
  )
}