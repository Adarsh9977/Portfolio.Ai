export interface Project {
    id: string
    userId: string
    name: string
    isAdded: boolean
    description: string | null
    url: string
    stars: number
    forks: number
    language: string | null
    isPrivate: boolean
    createdAt: Date
    updatedAt: Date
  }