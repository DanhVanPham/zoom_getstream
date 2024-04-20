import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

type MeetingSetupProps = {
  setIsSetupComplete: React.Dispatch<React.SetStateAction<boolean>>
}

const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false)
  const call = useCall()

  //   if (!call) throw new Error('useCall must be used in StreamCall component')

  useEffect(() => {
    if (isMicCamToggleOn) {
      call?.camera.disable()
      call?.microphone.disable()
    } else {
      call?.camera.enable()
      call?.microphone.enable()
    }
  }, [isMicCamToggleOn, call?.camera, call?.microphone])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggleOn}
            onChange={(e) => setIsMicCamToggleOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          setIsSetupComplete(true)
          call?.join()
        }}
      >
        Join Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup
