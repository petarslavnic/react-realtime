import { useEffect, useContext } from 'react'
import { ChannelContext } from '../context'

export const useRealTimeEventListener = (
  eventName: string, 
  eventCallback: (data: any) => void
): void => {
  const { channel } = useContext(ChannelContext)

  useEffect(
    () => {
      channel?.bind(eventName, eventCallback)

      return () => {
        channel?.unbind(eventName, eventCallback)
      }
    },
    [channel, eventName, eventCallback]
  )
}
