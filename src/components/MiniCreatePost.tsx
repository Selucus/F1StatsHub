"use client"

import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {

    const router = useRouter()
    const pathname = usePathname()

    
  return <li className='overflow-hidden roun'></li>
}

export default MiniCreatePost