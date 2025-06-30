import {z} from "zod"

export const PostValidator = z.object({
    title: z.string().min(3, {message: 'must be longer than 3 characters'}).max(128, {message: 'less than 128 characters'}),
    raceweekendId:  z.string(),
    content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>

