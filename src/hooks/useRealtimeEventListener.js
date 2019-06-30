import { useEffect, useContext } from 'react'
import { ChannelContext } from '../context'

export const useRealTimeEventListener = (eventName, eventCallback) => {
  const { bind, unbind } = useContext(ChannelContext)

  useEffect(
    () => {
      bind(eventName, eventCallback)

      return () => {
        unbind(eventName, eventCallback)
      }
    },
    [bind, unbind, eventName, eventCallback]
  )
}
