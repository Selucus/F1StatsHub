import { Vote, Chart } from '@prisma/client'
import { Link, MessageSquare } from 'lucide-react'
import { FC } from 'react'
import EditorOutput from './EditorOutput'

interface PostProps {
  raceweekendName: string
  post: Chart & {
    votes: Vote[]
  }
  commentNumber: number
}

const Post: FC<PostProps> = ({raceweekendName, post, commentNumber}) => {
  return <div className='rounded-md bg-white shadow'>
    <div className='px-6 py-4 flex justify-between'>
        {/* to do votes */}

        <div className='w-0 flex-1'>
            <div className='max-h-40 mt-1 text-xs text-gray-500'>
                {raceweekendName ? (
                    <>
                    <a className='underline text-zinc-900 text-sm underline-offset-2' href={`/r/${raceweekendName}`}>
                        {raceweekendName}
                    </a>
                    <span className='px-1'></span>
                    </>
                ) : null}

                <span></span>
            </div>
            <a href={`/r/${raceweekendName}/post/${post.id}`}>
                <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
                    {post.title} 
                </h1>
            </a>

            <div className='relative text-sm max-h-40 w-full overflow-clip' >
                <EditorOutput content={post.content}/>

          
            </div>
    
        </div>
    </div>

    <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'>
        <a className='w-fit flex items-center gap-2' href={`/r/${raceweekendName}/post/${post.id}`}>
                <MessageSquare className='h-4 w-4' />
                {commentNumber} comments
            </a>
    </div>

  </div>
}

export default Post