import { Post, Raceweekend } from "@prisma/client"

export type ExtendedPost = Post & {
    raceweekend: Raceweekend,
    votes: Vote[]
    comments: Comment[]
}