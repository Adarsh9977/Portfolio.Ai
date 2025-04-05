
import { fetchGithubRepos } from "@/actions/github/fetch-repos"
import { ProjectCard } from "./project-card"


export async function ProjectList() {
  const repos = await fetchGithubRepos();
if(!repos.projects) return (
    <div>Loading...</div>)
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

