import {z} from "zod"
{/* validation library */}

export const RaceweekendValidator = z.object({
    name: z.string().min(3).max(21),
})


export type CreateRaceweekendPayload = z.infer<typeof RaceweekendValidator>