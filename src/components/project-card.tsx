"use client"

import type { Project } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon, GitForkIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { addToPortfolio } from "@/actions/addToPortfolio/add-to-portfolio"
import { toast } from "sonner"
import { useState } from "react"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [addedLoading, setAddedLoading] = useState<boolean>(false)

    const handleAddedToPortfolio = async (project : Project) => {
        setAddedLoading(true);
        try {
            const res = await addToPortfolio(project);
        if(res.success){
            toast.success('Project added to portfolio!')
        }else{
            toast.error(res.error)
        }
        } catch (error) {
            setAddedLoading(false);
            console.error('Failed to add project to portfolio:', error);
            toast.error('Failed to add project to portfolio.');
        } finally {
            setAddedLoading(false); // Reset loading state after the reques
        }
    }

  return (
    <Card className="h-full flex flex-col border border-purple-600">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.language}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            <span>{project.stars}</span>
          </div>
          <div className="flex items-center">
            <GitForkIcon className="h-4 w-4 mr-1" />
            <span>{project.forks}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button size="sm" variant='outline' asChild>
          <Link href={project.url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </Link>
        </Button>
        <Button size="sm" className="bg-purple-400" onClick={(e)=>{
            e.preventDefault();
            handleAddedToPortfolio(project)
        }} variant='default'>
            {addedLoading ? 'Adding..': 'Add to Portfolio'}
            {addedLoading && <Loader2 className="h-4 animate-spin w-4 ml-2"/>}
        </Button>
      </CardFooter>
    </Card>
  )
}

