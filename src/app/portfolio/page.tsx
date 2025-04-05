'use client'
import { getPortfolio } from "@/actions/get-portfolio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from "sonner";

function cleanHtmlString(input: string): string {
  return input
    .replace(/```html\s*/g, "")  // removes ```html with optional whitespace
    .replace(/```/g, "");        // removes any remaining ```
}

const PortfolioPage =  () => {
const [portfolioHTML, setPortfolioHTML] = useState<string | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const router = useRouter();

  useEffect(() => {
    setLoading(true)
    const fetchProjects = async () => {
      try {
        const response = await getPortfolio();
        console.log(response)
        if (response.success && response.portfolioHTML) {
          const cleanedHTML = cleanHtmlString(response.portfolioHTML);
          setPortfolioHTML(cleanedHTML);
          toast.success('Portfolio fetched successfully')
        } else {
          router.push('/generate-portfolio')
          toast.error('Failed to fetch portfolio')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        toast.error('An error occurred while fetching projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="p-5">
      {portfolioHTML && !loading ?  <div dangerouslySetInnerHTML={{ __html: portfolioHTML }} /> : <p>Loading...</p>}
    </div>
  );
};

export default PortfolioPage;
