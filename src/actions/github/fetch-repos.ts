/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type FetchReposResult = {
  success: boolean;
  projects?: any[];
  error?: string;
};

export async function fetchGithubRepos(): Promise<FetchReposResult> {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Get GitHub access token
    const githubAccount = user.accounts.find(
      (account) => account.provider === "github"
    );

    if (!githubAccount?.access_token) {
      return { success: false, error: "GitHub account not connected" };
    }

    // Fetch repositories from GitHub API
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${githubAccount.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "web-builder"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repositories = await response.json();

    console.log(repositories)
    // Store repositories in database
    const projects = await Promise.all(
        repositories.map(async (repo: any) => {
          const existingProject = await prisma.project.findUnique({
            where: {
              userId_name: {
                userId: user.id,
                name: repo.name,
              },
            },
          });
      
          if (existingProject) {
            // Update the existing project
            return await prisma.project.update({
              where: {
                userId_name: {
                  userId: user.id,
                  name: repo.name,
                },
              },
              data: {
                description: repo.description ?? null,
                url: repo.html_url,
                stars: repo.stargazers_count ?? 0,
                isAdded: false,
                forks: repo.forks_count ?? 0,
                language: repo.language ?? null,
                isPrivate: repo.private ?? false,
                updatedAt: new Date(),
              },
            });
          } else {
            // Create a new project
            return await prisma.project.create({
              data: {
                userId: user.id,
                name: repo.name,
                description: repo.description ?? null,
                url: repo.html_url,
                isAdded: false,
                stars: repo.stargazers_count ?? 0,
                forks: repo.forks_count ?? 0,
                language: repo.language ?? null,
                isPrivate: repo.private ?? false,
              },
            });
          }
        })
      );
      

    console.log(projects)
    
    return {
      success: true,
      projects: projects,
    };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { success: false, error: "Failed to fetch repositories" };
  }
}