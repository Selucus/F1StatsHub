import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request){
    try{
        const body = req.json()

        const {postId, voteType} = PostVoteValidator.parse(body)

        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorised', {status: 401})
        }

        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                chartId: postId,
            }
        })

        const post = await db.chart.findUnique({
            where: {
                id: postId,

            },
            include: {
                votes: true
            }
        })

        if(!post){
            return new Response('Post not found', {status: 404})

        }

        if(existingVote){
            if(existingVote.type === voteType){
                await db.vote.delete({
                    where: {
                        userId_chartId: {
                            chartId: postId,
                            userId: session.user.id
                        }
                    }
                })

                return new Response('OK')
            }

            await db.vote.update({
                where: {
                    userId_chartId: {
                        chartId: postId,
                        userId: session.user.id
                    }
                },
                data: {
                    type: voteType,
                }
            })
            

            // recount votes
            const votesAmt = post.votes.reduce((acc: number, vote) => {
                if(vote.type === 'UP') return acc + 1
                if(vote.type === 'DOWN') return acc - 1
                return acc
            }, 0)
            
            if(votesAmt >= CACHE_AFTER_UPVOTES){
                const cachePayload: CachedPost = {
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                }
            }
        }

    } catch(error){

    }
}