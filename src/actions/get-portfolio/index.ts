'use server'

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"

export async function getPortfolio() : Promise<{success: boolean, portfolioHTML?: string | null, error?: string}>{
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
        }

        const portfolioHTML = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });
        
        if(!portfolioHTML) {
            return { success: false, error: "No portfolio found" };
        }

        return { success: true, portfolioHTML: portfolioHTML?.htmlFiles };

    } catch (error) {
        return { success: false, error: `Failed to fetch portfolio ${error}`};
    }


}