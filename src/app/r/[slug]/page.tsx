import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'


interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({params}: PageProps) => {
    const { slug } = params

    const session = await getAuthSession()

    const raceweekend = await db.raceweekend.findFirst({
        where: {name: slug},
        include: {
            charts: {
                include: {
                    votes: true,
                    comments: true,
                    raceweekend: true,
                }
            }
        },

        take: INFINITE_SCROLLING_RESULTS
    })


    if(!raceweekend){
        return notFound()
    }

  return (
    <>
    <h1 className='font-bold text-3xl md:text-4xl h-14'>{raceweekend.name}</h1>

    {/*<MiniCreatePost />*/}

    <PostFeed initialPosts={raceweekend.charts} raceweekName={raceweekend.name}/>


    </>
  )
}

export default page