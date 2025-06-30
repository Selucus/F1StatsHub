import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RaceweekendValidator } from "@/lib/validators/raceweekend";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorised', {status: 401})
        }

        const body = await req.json()

        const { name } = RaceweekendValidator.parse(body)
        
        const raceweekendExists = await db.raceweekend.findFirst({
            where: {
                name,
            },
        })
        
        if(raceweekendExists){
            return new Response('Raceweekend already exists', {status: 409})

            
        }

        const raceweekend = await db.raceweekend.create({
            data: {
                name, 
                
            },
        })

        return new Response(raceweekend.name)
        
    } catch (error){
        if(error instanceof z.ZodError){
            return new Response(error.message, {status: 422})
        }
        

        return new Response('Could not create raceweekend', {status: 500})
    }
}