'use client'

import { ReactNode, useEffect, useState } from 'react'
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'

import { tokenProvider } from '@/actions/stream.actions'
import Loader from '@/components/Loader'

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState('')
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetch = async () => {
      const token = await tokenProvider()
      console.log(token)
      setToken(token)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!isLoaded || !user || !token) return
    if (!API_KEY) throw new Error('Stream API key is missing')
    console.log(token)
    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      token,
    })

    setVideoClient(client)
  }, [user, isLoaded, token])

  if (!videoClient) return <Loader />

  return <StreamVideo client={videoClient}>{children}</StreamVideo>
}

export default StreamVideoProvider
