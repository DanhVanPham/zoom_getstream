// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation'
import { Call, CallRecording } from '@stream-io/video-react-sdk'
import MeetingCard from './MeetingCard'
import Loader from './Loader'
import { useToast } from './ui/use-toast'

type CallListProps = {
  type: 'upcoming' | 'ended' | 'recordings'
}

const CallList = ({ type }: CallListProps) => {
  const { endedCalls, callRecordings, upcomingCalls, isLoading } = useGetCalls()
  const router = useRouter()
  const [recordings, setRecordings] = useState<Call[]>([])
  const toast = useToast()

  const getCalls = () => {
    switch (type) {
      case 'recordings':
        return recordings
      case 'ended':
        return endedCalls
      case 'upcoming':
        return upcomingCalls
      default:
        return []
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'recordings':
        return 'No Recordings'
      case 'ended':
        return 'No Previous Calls'
      case 'upcoming':
        return 'No Upcoming Calls'
      default:
        return ''
    }
  }

  const getIconCall = () => {
    switch (type) {
      case 'ended':
        return '/icons/previous.svg'
      case 'upcoming':
        return '/icons/upcoming.svg'
      case 'recordings':
      default:
        return '/icons/recordings.svg'
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()),
        )
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings)

        setRecordings(recordings)
      } catch (error) {
        console.log(error)
        toast({ title: 'Try again later' })
      }
    }

    if (type === 'recordings') fetchRecordings()
  }, [type, callRecordings])

  const calls = getCalls()
  const callMessage = getNoCallsMessage()

  const handleNavigate = (param) => {
    if (type === 'recordings') {
      router.push(`${param?.url}`)
    } else {
      router.push(`/meeting/${param?.id}`)
    }
  }

  if (isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          return (
            <MeetingCard
              key={(meeting as Call).id}
              icon={getIconCall()}
              title={
                (meeting as Call).state?.custom?.description?.substring(
                  0,
                  26,
                ) ||
                meeting.filename?.substring(0, 20) ||
                'Personal Meeting'
              }
              date={
                meeting.state?.startsAt.toLocaleString() ||
                meeting.start_time.toLocaleString()
              }
              isPreviousMeeting={type === 'ended'}
              buttonIcon1={
                type === 'recordings' ? '/icons/play.svg' : undefined
              }
              buttonText={type === 'recordings' ? 'Play' : 'Start'}
              link={
                type === 'recordings'
                  ? meeting.url
                  : `
                ${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}
              `
              }
              handleClick={() =>
                handleNavigate({ url: meeting.url, id: meeting.id })
              }
            />
          )
        })
      ) : (
        <h1>{callMessage}</h1>
      )}
    </div>
  )
}

export default CallList
