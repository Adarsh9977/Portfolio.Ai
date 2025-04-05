'use server'
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function savePortfolioToDatabase (portfolioHTML: string) {
    if(!portfolioHTML) {
        return { success: false, error: "No portfolio found" };
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
    }
    // Get the user from database
    await prisma.user.update({
        where: { id: session.user.id },
        data: { htmlFiles: portfolioHTML },
    })
    return { success: true , message: "Portfolio saved" };
}
