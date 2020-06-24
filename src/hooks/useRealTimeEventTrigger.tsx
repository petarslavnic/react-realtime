import { useContext, useCallback } from 'react'
import { ChannelContext } from '../context'

export const useRealTimeEventTrigger = (): (event: string, data: any) => boolean => {
  const { channel } = useContext(ChannelContext)

  const trigger = useCallback(
    (event: string, data: any): boolean => {
      if (channel) {
        return channel.trigger(event, data)
      }
      return false
    },
    [channel],
  )

  return trigger
}
