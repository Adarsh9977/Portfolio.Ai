/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Project } from "@/lib/types";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });


export async function addToPortfolio(project : Project) {
    if(!project) {
      return { success: false, error: "Project is required." };
    }
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }
    const isProjectAdded = await prisma.project.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: project.name,
        }
      },
      select: {
        id: true,
        isAdded: true,
      }
    })

    if(isProjectAdded?.isAdded) {
      return { success: false, error: "Project already exists" };
    };

    const prompt = `I have this html file ${user.htmlFiles} and if the ${project.name} is not in the projects sestion of my html file, add ${project} to the html file and return the updated html file. with ${project} in the html file. add this inside my projects section of the html file. having name ${project.name} and description ${project.description} and link ${project.url} and ${project.language} and update the html file. and please don't update change anything previously in the html file. just add ${project } to the html file in projects section.  
    4. PROJECTS SECTION (min-height: 100vh) WITH BENTO GRID:
    <section id="projects" class="min-h-screen py-20 bg-white dark:bg-black">
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-black dark:text-white">
          My <span class="text-gray-700 dark:text-gray-300">Projects</span>
        </h2>
        
        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Featured Project (spans 2 columns on desktop) -->
          <div class="md:col-span-2 lg:col-span-2 group">
            <div class="h-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div class="relative h-64 overflow-hidden">
                <img src="[project-image]" alt="[Project Name]" class="w-full z-30 h-full object-cover transition duration-500 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                  <div class="p-4">
                    <div class="flex gap-3">
                      <a href="#" class="px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition">Live Demo</a>
                      <a href="#" class="px-3 py-1 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-600 transition">GitHub</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">[Project Name]</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">[Project description - keep it concise but informative]</p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">
                    [Technology 1]
                  </span>
                  <!-- Repeat for other technologies -->
                </div>
              </div>
            </div>
          </div>
          
          <!-- Regular Project Cards -->
          <div class="group">
            <div class="h-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <!-- Same structure as featured project but different content -->
            </div>
          </div>
          
          <!-- Repeat for other projects -->
        </div>
      </div>
    </section>
    add this section to the html file. with details of ${project} and add it to the html file. and please don't update change anything previously in the html file. just add ${project } to the html file in projects section.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const updatedHTML = response.text(); // Extract AI-generated HTML
    console.log("RESPONSED text", updatedHTML);

    // Store repositories in database
    const addedProject = await prisma.project.update({
      where: {
        userId_name: {
          userId: user.id,
          name: project.name,
        }
      },
      data: {
        isAdded: true,
        updatedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        htmlFiles: updatedHTML,
      },
    });

    return {
      success: true,
      projects: addedProject,
    };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { success: false, error: "Failed to fetch repositories" };
  }
}