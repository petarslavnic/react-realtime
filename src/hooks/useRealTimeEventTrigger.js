import { useContext } from 'react'
import { ChannelContext } from '../context'

export const useRealTimeEventTrigger = () => {
  const { trigger } = useContext(ChannelContext)

  return trigger
}
