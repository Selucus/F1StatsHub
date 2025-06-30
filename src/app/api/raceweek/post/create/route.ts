import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { RaceweekendValidator } from "@/lib/validators/raceweekend";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorised', {status: 401})
        }

        const body = await req.json()

        const { raceweekendId, title, content } = PostValidator.parse(body)
        
      
        
        // this is where we need to add url for chart
        await db.chart.create({
            data: {
                title,
                content,
                raceweekendId,
                imageUrl: '',
                chartType: '',
            },
        })
        return new Response('ok')


        
        
    } catch (error){
        if(error instanceof z.ZodError){
            return new Response(error.message, {status: 422})
        }
        

        return new Response('Could not create chart post', {status: 500})
    }
}