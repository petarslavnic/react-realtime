import { useContext } from 'react'
import { ChannelContext } from '../context'

export const useRealTimeEventTrigger = (): ((event: string, data: any) => boolean) | undefined => {
  const { channel } = useContext(ChannelContext)

  return channel?.trigger
}
