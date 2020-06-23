import { useEffect, useContext } from 'react'
import { ServiceContext } from '../context'

export const useRealTimeConnectionEventListener = (
  eventName: string, 
  eventCallback: (data: any) => void
): void => {
  const { pusher } = useContext(ServiceContext)

  useEffect(
    () => {
      pusher?.connection?.bind(eventName, eventCallback)

      return () => {
        pusher?.connection?.unbind(eventName, eventCallback)
      }
    },
    [pusher, eventName, eventCallback]
  )
}
