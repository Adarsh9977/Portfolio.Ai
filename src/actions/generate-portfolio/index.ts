'use server'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateHTML } from "../generate";
import prisma from "@/lib/prisma";

const generatePortfolioHandler = async (resumeText: string) => {
  const session = await getServerSession(authOptions);
  console.log(session)
  try {
    if (!resumeText) {
      return { error: "Resume text is required." };
    }

    if (!session) {
      return { error: "Authentication required" };
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        isAdded: true,
      },
    });

    console.log("Generating portfolio for received resume text...");

    const portfolioHTML = await generateHTML(resumeText, projects, session);

    return {
      success: true,
      portfolio: portfolioHTML,
    }
  } catch (error) {
    console.log(error);
    return { error: "Failed to generate portfolio." };
  }

}

export const generatePortfolio = generatePortfolioHandler;