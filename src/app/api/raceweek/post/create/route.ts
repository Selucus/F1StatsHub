import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { RaceweekendValidator } from "@/lib/validators/raceweekend";
import { z } from "zod";

export async function POST(req: Request) {
    console.log("in post")
    try {
        const session = await getAuthSession()
        console.log("session got")
        if(!session?.user){
            return new Response('Unauthorised', {status: 401})
        }

        const body = await req.json()

        const { raceweekendId, title, content } = PostValidator.parse(body)
        
        console.log(raceweekendId)
        
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
        
        console.error("Chart Post Error:", error)

        return new Response('Could not create chart post', {status: 500})
    }
}